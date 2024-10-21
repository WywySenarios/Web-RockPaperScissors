import datetime
print("Regenerating graphs...")
fileToWrite = open("public/assets/output.txt", "w")

fileToWrite.write(str(datetime.datetime.now()))
fileToWrite.close()