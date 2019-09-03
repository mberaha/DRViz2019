import json
import logging
import tornado.web


class LdaHandler(tornado.web.RequestHandler):
    """
    An Handler is an object that "handles" the requests made to a specific
    route of a server.
    This class takes the argument from a post method and returns a REST
    response
    """
    REQUIRED_ARGS = ['query']
    EXTRA_ARGS = []

    def initialize(self, lda):
        """
        Args
         - resultObj: an object (proto) to store the results of the analysis.
        """
        print("initialized")
        self.lda = lda

    async def get(self):
        logging.info("Inside Get")
        topicNum = self.get_query_argument("topic", default="1").strip()
        logging.info("Topic: {0}".format(topicNum))
        topicNum = int(topicNum)
        wordsAndScores, locations, counts, maxCount, times = \
            self.lda.getTopicStats(topicNum)
        locations = locations.tolist()
        times = times.tolist()
        self.render(
            "../resources/milan_tweets.html",
            wordsAndScores=wordsAndScores, locations=locations,
            counts=counts, maxCount=maxCount, times=times, topic=topicNum)
