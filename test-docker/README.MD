## Connect to the host docker daemon
### Tests (Win Setups Can Vary)

* docker run -it -v /var/run/docker.sock:/var/run/docker.sock docker-test
* docker run -it -v //./pipe/docker_engine:/var/run/docker.sock docker-test