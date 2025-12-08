
import redis

class RedisConsumer:
    def __init__(self, host, port, channel):
        self.redis = redis.Redis(host=host, port=port)
        self.pubsub = self.redis.pubsub()
        self.pubsub.subscribe(channel)

    def consume_messages(self, message_handler):
        for message in self.pubsub.listen():
            if message['type'] == 'message':
                message_handler(message['data'])
