"""
Usage:
python3 -m scripts.run_server
"""
import argparse
import logging

from http_wrapper.server import LdaServer


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--lda_file", type=str,
                        default="data/fitted_lda.pickle")
    parser.add_argument("--port", type=int, default=8666)
    args = parser.parse_args()
    # Logging
    logging.basicConfig(
        format='%(asctime)s - %(filename)s:%(lineno)s - %(levelname)s - %(message)s',
        level=logging.INFO
    )

    server = LdaServer(args.port, args.lda_file)
    server.run()
