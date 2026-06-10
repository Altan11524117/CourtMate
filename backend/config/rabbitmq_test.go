package config

import (
	"encoding/json"
	"log"
	"testing"
	"time"

	amqp "github.com/rabbitmq/amqp091-go"
)

// TestPublishMessage tests publishing a message to RabbitMQ
func TestPublishMessage(t *testing.T) {
	// This test requires RabbitMQ to be running
	// You can run this with: docker-compose up -d rabbitmq

	// Try to connect to RabbitMQ
	conn, err := amqp.Dial("amqp://guest:guest@localhost:5672/")
	if err != nil {
		t.Skip("RabbitMQ is not available, skipping test")
		return
	}
	defer conn.Close()

	ch, err := conn.Channel()
	if err != nil {
		t.Fatalf("Failed to open channel: %v", err)
	}
	defer ch.Close()

	// Declare test queue
	testQueue := "test_queue_" + time.Now().Format("20060102150405")
	q, err := ch.QueueDeclare(testQueue, false, true, false, false, nil)
	if err != nil {
		t.Fatalf("Failed to declare queue: %v", err)
	}

	// Publish test message
	testMessage := map[string]string{
		"event": "TestMessage",
		"text":  "Hello RabbitMQ",
	}

	body, _ := json.Marshal(testMessage)

	ctx, cancel := time.NewContext(time.Background(), 5*time.Second)
	defer cancel()

	err = ch.PublishWithContext(ctx,
		"",
		testQueue,
		false,
		false,
		amqp.Publishing{
			ContentType: "application/json",
			Body:        body,
		})

	if err != nil {
		t.Fatalf("Failed to publish message: %v", err)
	}

	// Consume the message
	msgs, err := ch.Consume(testQueue, "", true, false, false, false, nil)
	if err != nil {
		t.Fatalf("Failed to consume message: %v", err)
	}

	// Wait for message
	select {
	case msg := <-msgs:
		var received map[string]string
		json.Unmarshal(msg.Body, &received)

		if received["event"] != "TestMessage" {
			t.Errorf("Expected 'TestMessage', got '%s'", received["event"])
		}
		log.Printf("✓ Message received successfully: %s", string(msg.Body))

	case <-time.After(5 * time.Second):
		t.Fatal("Timeout waiting for message")
	}
}

// TestRabbitMQConnection tests the connection to RabbitMQ
func TestRabbitMQConnection(t *testing.T) {
	conn, err := amqp.Dial("amqp://guest:guest@localhost:5672/")
	if err != nil {
		t.Skip("RabbitMQ is not available, skipping test")
		return
	}
	defer conn.Close()

	if conn == nil {
		t.Fatal("Connection is nil")
	}

	log.Println("✓ RabbitMQ connection test passed")
}

// TestQueueDeclare tests queue declaration
func TestQueueDeclare(t *testing.T) {
	conn, err := amqp.Dial("amqp://guest:guest@localhost:5672/")
	if err != nil {
		t.Skip("RabbitMQ is not available, skipping test")
		return
	}
	defer conn.Close()

	ch, err := conn.Channel()
	if err != nil {
		t.Fatalf("Failed to open channel: %v", err)
	}
	defer ch.Close()

	q, err := ch.QueueDeclare("test_queue", true, false, false, false, nil)
	if err != nil {
		t.Fatalf("Failed to declare queue: %v", err)
	}

	if q.Name != "test_queue" {
		t.Errorf("Expected queue name 'test_queue', got '%s'", q.Name)
	}

	log.Printf("✓ Queue declared successfully: %s (Messages: %d)", q.Name, q.Messages)
}
