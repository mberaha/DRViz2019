import argparse
import pandas as pd
from lda.lda import OnlineLDA

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--input_file", type=str, default="data/dati-twitter-clean.tsv")
    parser.add_argument(
        "--output_file", type=str, default="data/fitted_lda.pickle")
    parser.add_argument("--n_topics", type=int, default=80)
    args = parser.parse_args()

    df = pd.read_csv(args.input_file, sep="\t")
    docs = df["text"].tolist()
    dates = df["date"].values
    locations = df[["latitude", "longitude"]].values
    nils = df["nil"].values

    lda = OnlineLDA(args.n_topics)
    lda.fit(docs, locations, nils, dates)
    lda.save(args.output_file)
