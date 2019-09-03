import logging
import tornado.web
from http_wrapper.handler import LdaHandler
from lda.lda import OnlineLDA


class LdaServer(object):
    def __init__(self, port, ldafile="data/fitted_lda.pickle"):
        self.port = port
        self.lda = OnlineLDA()
        self.lda.restore(ldafile)
        print("restored")

    def getRoutes(self):
        routes = [
            (r"/", LdaHandler, {"lda": self.lda}),
            (r"/static/(.*)",
             tornado.web.StaticFileHandler,
             {"path": r"resources/"})]
        return routes

    def makeApp(self):
        routes = self.getRoutes()
        return tornado.web.Application(routes, {})

    def run(self):
        app = self.makeApp()
        self.http_server = tornado.httpserver.HTTPServer(app)
        self.http_server.listen(self.port)
        logging.info('Server {0} is up and listening port {1}'.format(
            self.__class__.__name__, self.port))
        tornado.ioloop.IOLoop.instance().start()

    def stop(self):
        self.http_server.stop()
        if self.log:
            logging.info('Stopping server {0} gracefully'.format(
                self.__class__.__name__))
        tornado.ioloop.IOLoop.instance().stop()
