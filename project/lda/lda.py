import numpy as np
import pickle
from collections import Counter
from sklearn.decomposition import LatentDirichletAllocation
from sklearn.feature_extraction.text import CountVectorizer


class OnlineLDA(object):
    def __init__(self, n_topics=10):
        self.n_topics = n_topics
        self.lda = LatentDirichletAllocation(n_topics)

    def fit(self, documents, locations, nils, times):
        self.locations = locations
        self.nils = nils
        self.times = times
        self.vectorizer = CountVectorizer()
        X = self.vectorizer.fit_transform(documents)
        self.idx2word = self.vectorizer.get_feature_names()

        topicsPerDoc = self.lda.fit_transform(X)
        self.topicsPerDoc = np.argmax(topicsPerDoc, axis=1)
        self.maxCountByNil = 0.0
        for topic in range(self.n_topics):
            cnt = max(self.getCountByNil(topic))
            if cnt > self.maxCountByNil:
                self.maxCountByNil = cnt

        self.maxLogCountByNil = np.log(1 + self.maxCountByNil)

    def getTopicStats(self, topicNum):
        wordsAndScores = self.getWordsAndScores(topicNum)
        docIdx = np.where(self.topicsPerDoc == topicNum)
        locations = self.locations[docIdx]
        times = self.times[docIdx]
        counts = self.getCountByNil(topicNum)
        normCounts = [
            np.log(2 + x) / self.maxLogCountByNil for x in counts]
        return wordsAndScores, locations, normCounts, self.maxCountByNil, times

    def getWordsAndScores(self, topicNum, topk=20):
        topic = self.lda.components_[topicNum, :]
        topic /= np.sum(topic)
        out = [
            [self.idx2word[i], topic[i]]
            for i in topic.argsort()[:-topk - 1:-1]]
        return out

    def getLocations(self, topicNum):
        idx = np.where(self.topicsPerDoc == topicNum)
        return self.locations[idx]

    def getCountByNil(self, topicNum):
        idx = np.where(self.topicsPerDoc == topicNum)
        counts = Counter(self.nils[idx])
        out = []
        for n in range(88):
            out.append(counts.get(n + 1, 0))
        return out

    def getTimes(self, topicNum):
        idx = np.where(self.topicsPerDoc == topicNum)
        return self.locations[idx]

    def save(self, filename):
        with open(filename, "wb") as fp:
            pickle.dump(self.__dict__, fp)

    def restore(self, filename):
        with open(filename, "rb") as fp:
            curr = pickle.load(fp)

        self.__dict__.update(curr)
