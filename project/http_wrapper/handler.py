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
        self.lda = lda

    async def get(self):
        topicNum = self.get_query_argument("topic", default="1").strip()
        logging.info("Topic: {0}".format(topicNum))
        topicNum = int(topicNum) - 1
        if topicNum < 0 or topicNum >= self.lda.n_topics:
            logging.error("Topic does not exist")
            wordsAndScores = []
            locations = []
            counts = []
            maxCount = 0
            times = []
            msg = "Topic must be between 0 and {0}".format(
                self.lda.n_topics - 1)
        else:
            wordsAndScores, locations, counts, maxCount, times = \
                self.lda.getTopicStats(topicNum)
            locations = locations.tolist()
            times = times.tolist()
            msg = ""
        self.render(
            "../resources/milan_tweets.html",
            wordsAndScores=wordsAndScores, locations=locations,
            counts=counts, maxCount=maxCount, times=times,
            topic=topicNum + 1, ntopics=self.lda.n_topics)
