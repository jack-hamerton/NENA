
from kafka import KafkaConsumer
import json

class MessageConsumer:
    def __init__(self, bootstrap_servers, topic):
        self.consumer = KafkaConsumer(
            topic,
            bootstrap_servers=bootstrap_servers,
            value_deserializer=lambda m: json.loads(m.decode('ascii')))

    def consume_messages(self, message_handler):
        for message in self.consumer:
            message_handler(message.value)
