package config

import (
	"context"
	"encoding/json"
	"log"
	"os"
	"time"

	amqp "github.com/rabbitmq/amqp091-go"
)

var RabbitConn *amqp.Connection
var RabbitChannel *amqp.Channel

// PublishMessage sends a message to the specified queue
func PublishMessage(queueName string, message interface{}) error {
	if RabbitChannel == nil {
		log.Println("Warning: RabbitMQ channel is not initialized, skipping message publish.")
		return nil
	}

	body, err := json.Marshal(message)
	if err != nil {
		return err
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err = RabbitChannel.PublishWithContext(ctx,
		"",        // exchange
		queueName, // routing key
		false,     // mandatory
		false,     // immediate
		amqp.Publishing{
			ContentType: "application/json",
			Body:        body,
		})

	if err != nil {
		log.Printf("Failed to publish message: %v\n", err)
		return err
	}

	log.Printf("Message published to %s: %s\n", queueName, string(body))
	return nil
}

func ConnectRabbitMQ() {
	rabbitURL := os.Getenv("RABBITMQ_URL")
	if rabbitURL == "" {
		rabbitURL = "amqp://guest:guest@localhost:5672/"
	}

	conn, err := amqp.Dial(rabbitURL)
	if err != nil {
		log.Println("Warning: Could not connect to RabbitMQ. Events will not be published.", err)
		return
	}

	ch, err := conn.Channel()
	if err != nil {
		log.Println("Warning: Failed to open a channel.", err)
		return
	}

	// Declare the queue
	q, err := ch.QueueDeclare(
		"ad_events", // name
		true,        // durable
		false,       // delete when unused
		false,       // exclusive
		false,       // no-wait
		nil,         // arguments
	)
	if err != nil {
		log.Println("Warning: Failed to declare a queue.", err)
		return
	}

	RabbitConn = conn
	RabbitChannel = ch

	log.Println("Connected to RabbitMQ successfully!")

	// Start a background consumer
	go startConsumer(q.Name)
}

func startConsumer(queueName string) {
	if RabbitChannel == nil {
		return
	}

	msgs, err := RabbitChannel.Consume(
		queueName, // queue
		"",        // consumer
		true,      // auto-ack
		false,     // exclusive
		false,     // no-local
		false,     // no-wait
		nil,       // args
	)
	if err != nil {
		log.Println("Warning: Failed to register a consumer.", err)
		return
	}

	log.Println("RabbitMQ Consumer started. Waiting for messages...")

	for d := range msgs {
		log.Printf("[RabbitMQ Consumer] Received event: %s", d.Body)
	}
}
