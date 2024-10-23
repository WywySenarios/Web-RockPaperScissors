import datetime # datetime creates UIDs for user input because node js typically runs asynchronously
print("Regenerating graphs...")
fileToWrite = open("public/assets/output.txt", "w")

fileToWrite.write(str(datetime.datetime.now()))
fileToWrite.close()

# using Matplotlib to draw graphs :)))
import numpy
from matplotlib import pyplot
