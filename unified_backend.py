from tensorflow.keras.models import load_model
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import os
from sentence_transformers import SentenceTransformer
import pickle
from predictimagename import predictingfoodnamefrom_image
import json
from predictimage_fromtext import predictText
import pandas as pd
import faiss
from recipe_routes import recommend_recipe
from ngo_routes import ngo_map
from flask_cors import CORS
from app4 import signup, login
from update import updateUsers



app = Flask(__name__)
CORS(app)


print("connecting to db")
mongoDB = "mongodb://localhost:27017/"
client = MongoClient(mongoDB)
db = client["CollegeProject"]
ngo_collection = db['NGO_DB']
collection = db["food"] 
userDB = db["userDB"] 
#app.config["MONGO_URI"] = "mongodb://localhost:27017/CollegeProject"
#mongo = PyMongo(app)

#userDB = mongo.db.users


print("loading model")
model = load_model("food_prediction_10epoches.h5")
print("\033[92mModel Loaded Successfully\033[0m")


print("Loading CSV...")
df = pd.read_csv("RAW_recipes.csv")

print("Loading FAISS index...")
index = faiss.read_index("recipes.index")

print("loading text embeddings")
with open("food_embeddings.pkl", "rb") as f:
    food_list, food_embeddings = pickle.load(f)


print("Paraphrase model...")
para_model = SentenceTransformer("paraphrase-MiniLM-L6-v2")
print("para loaded")

print("loading sentence transformer")
nlp_model = SentenceTransformer("all-MiniLM-L6-v2")
print("nlp model loaded")


print("detecting label")
labelPath = "labels.json"
if os.path.exists(labelPath) and os.path.getsize(labelPath) > 0:
  print("opening localPath")
  with open(labelPath, "r") as f:
      labels = json.load(f)
  labels = {str(k): v for k, v in labels.items()}  # if key is present return it's value
  print("label.json Loaded")
else:
  print("No label.json found. Creating from dataset!")
  datagen = ImageDataGenerator(rescale=1./255, validation_split=0.2)
  print("resizing image")
  generator = datagen.flow_from_directory(
      'images',
      target_size=(224, 224),
      batch_size=32,
      class_mode='categorical',
      subset='training'
  )
  print("creating label")
  labels = {str(v): k for k, v in generator.class_indices.items()}
  with open(labelPath, "w") as f:
      json.dump(labels, f, indent=4)
  print("label.json Created!")




# signup page
@app.route('/signup', methods=['POST'])
def signup_route():
    return signup(userDB)  

@app.route('/login', methods=['POST'])
def login_route():
    return login(userDB)



print("predicting food")
@app.route("/predictFoodFromText", methods=["POST"])
def predict_food_from_text():
    print("api working")
    data = request.json or {}
    user_text = data.get("text", "")

    result = predictText(collection, nlp_model, user_text)
    return result


print("predicting food")
@app.route("/predictFoodName", methods=["POST"])
def predict():
    #print("looking correctness of img")
    return predictingfoodnamefrom_image(model, collection, labels)


print("recipe generation")
@app.route("/recommend", methods=["POST"])
def recommend():
    return recommend_recipe(df, para_model, index)


print("connecting ngo")
@app.route('/search', methods=['GET'])
def search_ngos():
    return ngo_map(ngo_collection)



@app.route('/update_user', methods=['PUT'])
def update_user():
    return updateUsers(userDB)


print("flask started")
if __name__ == "__main__":
    app.run(debug=True)
