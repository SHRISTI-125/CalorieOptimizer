import pickle
import numpy as np
from flask import request, jsonify

print("loading text embeddings")
with open("food_embeddings.pkl", "rb") as f:
    food_list, food_embeddings = pickle.load(f)


def predictText(collection, nlp_model, inputText):

    def text_prediction(inputText):
        if not inputText:
            return None
        
        print("Encoding text into number")
        inputText = inputText.lower()
        inputText = inputText.replace("_", " ")
        user_emb = nlp_model.encode([inputText])[0]

        # content based; cosine similarity
        print("using cosine similarity")
        cos_sim = np.dot(food_embeddings, user_emb) / (
            np.linalg.norm(food_embeddings, axis=1) * np.linalg.norm(user_emb)
        )

        idx = np.argmax(cos_sim)
        min_angle = cos_sim[idx]

        print("better score:", min_angle)

        if min_angle < 0.40: # if angle betwenn 0 to 40 degree
            return None

        return food_list[idx]
    
    #main
    try:
        data = request.json or {"text": "apple pie"} # by default either text or apple_pie as input
        inputText = data.get("text", "")

        print("finding cos similarity")
        food = text_prediction(inputText)

        if not food:
            return jsonify({
                "status": "not_found",
                "message": "Nothing similar match found"
            })

        # Find in DB
        print("searching in database")
        food_db = collection.find_one({"foodname": food})
        if food_db:
            food_db.pop("_id", None)

        return jsonify({
            "predicted_food": food,
            "details": food_db or "Not in DB"
        })

    except Exception as e:
        return jsonify({"error": str(e)})
