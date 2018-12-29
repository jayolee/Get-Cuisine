from sklearn.pipeline import Pipeline
from sklearn.neighbors import KNeighborsClassifier
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfTransformer
import pandas as pd

traindata=[]
testdata=[]
train_cuisine=[]
train_ingre=[]
test_cuisine=[]
test_ingre=[]

#Get the train data
traindata=pd.read_json("Final/all/train.json")
#Join the ingredients as a string with commas
traindata["ingre_list"]=traindata['ingredients'].apply(lambda x: ','.join(x))
traindata_ingre=traindata['ingre_list']
traindata_cuisine=traindata['cuisine']

model1 = Pipeline([
    ('CountVectorizer', CountVectorizer()), 
    ('TfidfTransformer', TfidfTransformer()),  
    ('KNeighborsClassifier',  KNeighborsClassifier()),
    ])
model1.fit(traindata_ingre, traindata_cuisine)

#create pickle file
import pickle 
pickle.dump(model1, open("model.pkl","wb"))
