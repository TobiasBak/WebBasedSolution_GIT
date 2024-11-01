import os

from behave.__main__ import main as behave_main

from logic.fileReader import readFile


def main():
    readFile()
    path = os.path.join(os.path.dirname(__file__))

    print(f"Filepath for main to run behave from: {path}")
    
    # Starts test
    behave_main([path] + ["--stop"])

if __name__ == '__main__':
    main()