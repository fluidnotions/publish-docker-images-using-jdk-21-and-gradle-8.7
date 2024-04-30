import subprocess

def check_docker_connection():
    try:
        result = subprocess.run(['docker', 'ps'], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        print("Docker is accessible! Here's the list of running containers:")
        print(result.stdout.decode())
    except subprocess.CalledProcessError as e:
        print("Failed to access Docker:")
        print(e.stderr.decode())

if __name__ == "__main__":
    check_docker_connection()
