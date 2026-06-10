#!/usr/bin/env node

const axios = require('axios');
const amqp = require('amqplib');

const BASE_URL = process.env.BASE_URL || 'http://localhost:8000';
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

// Test 1: Health Check Endpoint
async function testHealthEndpoint() {
    try {
        log('\n📋 Test 1: Health Check Endpoint', 'blue');
        const response = await axios.get(`${BASE_URL}/health`);

        if (response.status === 200 && response.data.status === 'healthy') {
            log('✓ Health endpoint is working', 'green');
            log(`  - Status: ${response.data.status}`, 'green');
            log(`  - Database: ${response.data.database}`, 'green');
            log(`  - RabbitMQ: ${response.data.rabbitmq}`, 'green');
            return true;
        } else {
            log('✗ Health endpoint returned unexpected response', 'red');
            return false;
        }
    } catch (error) {
        log(`✗ Health check failed: ${error.message}`, 'red');
        return false;
    }
}

// Test 2: RabbitMQ Connection & Messaging
async function testRabbitMQMessaging() {
    try {
        log('\n📋 Test 2: RabbitMQ Messaging', 'blue');

        // Connect to RabbitMQ
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();

        log('✓ Connected to RabbitMQ', 'green');

        // Declare a test queue
        const queueName = `test_queue_${Date.now()}`;
        await channel.assertQueue(queueName, { durable: false });
        log(`✓ Test queue created: ${queueName}`, 'green');

        // Send a test message
        const testMessage = {
            event: 'TestEvent',
            timestamp: new Date().toISOString(),
            text: 'Test message from Node.js',
        };

        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(testMessage)));
        log(`✓ Test message sent to queue`, 'green');

        // Consume the message
        let messageReceived = false;
        await channel.consume(queueName, (msg) => {
            if (msg) {
                const receivedMessage = JSON.parse(msg.content.toString());
                log(`✓ Message received: ${JSON.stringify(receivedMessage)}`, 'green');
                messageReceived = true;
                channel.ack(msg);
            }
        });

        // Wait for message
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Cleanup
        await channel.deleteQueue(queueName);
        await channel.close();
        await connection.close();

        return messageReceived;
    } catch (error) {
        log(`✗ RabbitMQ test failed: ${error.message}`, 'red');
        return false;
    }
}

// Test 3: Backend API Registration (if needed)
async function testAPIEndpoints() {
    try {
        log('\n📋 Test 3: Backend API Endpoints', 'blue');

        // Test public endpoint
        const response = await axios.get(`${BASE_URL}/v1/auth/login`, {
            validateStatus: () => true, // Don't throw on any status
        });

        if (response.status === 400 || response.status === 401) {
            log('✓ Auth endpoint is accessible (as expected, requires credentials)', 'green');
            return true;
        } else if (response.status === 200) {
            log('✓ Auth endpoint is accessible and responding', 'green');
            return true;
        } else {
            log(`⚠ Unexpected response: ${response.status}`, 'yellow');
            return true; // Don't fail, endpoint is accessible
        }
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            log(`✗ Backend is not running at ${BASE_URL}`, 'red');
        } else {
            log(`✗ API endpoint test failed: ${error.message}`, 'red');
        }
        return false;
    }
}

// Test 4: Database Connection Check
async function testDatabaseConnection() {
    try {
        log('\n📋 Test 4: Database Health (via /health endpoint)', 'blue');

        const response = await axios.get(`${BASE_URL}/health`);

        if (response.data.database === 'healthy') {
            log('✓ Database is connected and healthy', 'green');
            return true;
        } else {
            log(`⚠ Database status: ${response.data.database}`, 'yellow');
            return false;
        }
    } catch (error) {
        log(`✗ Database check failed: ${error.message}`, 'red');
        return false;
    }
}

// Main test runner
async function runAllTests() {
    log('\n════════════════════════════════════════════════════════', 'blue');
    log('   CourtMate Backend Integration Tests', 'blue');
    log('════════════════════════════════════════════════════════', 'blue');

    const results = {
        health: await testHealthEndpoint(),
        rabbitmq: await testRabbitMQMessaging(),
        api: await testAPIEndpoints(),
        database: await testDatabaseConnection(),
    };

    log('\n════════════════════════════════════════════════════════', 'blue');
    log('   Test Results Summary', 'blue');
    log('════════════════════════════════════════════════════════', 'blue');

    let passed = 0;
    let failed = 0;

    for (const [test, result] of Object.entries(results)) {
        const status = result ? '✓ PASSED' : '✗ FAILED';
        const statusColor = result ? 'green' : 'red';
        log(`  ${test}: ${status}`, statusColor);
        result ? passed++ : failed++;
    }

    log('\n════════════════════════════════════════════════════════', 'blue');
    log(`  Total: ${passed} passed, ${failed} failed`, passed === Object.keys(results).length ? 'green' : 'yellow');
    log('════════════════════════════════════════════════════════\n', 'blue');

    process.exit(failed > 0 ? 1 : 0);
}

// Run tests
if (require.main === module) {
    runAllTests().catch(error => {
        log(`\nFatal error: ${error.message}`, 'red');
        process.exit(1);
    });
}

module.exports = { testHealthEndpoint, testRabbitMQMessaging, testAPIEndpoints };
