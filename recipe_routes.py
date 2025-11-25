import ast
import math
from flask import request, jsonify


def recommend_recipe(df, model, index):
    def converting_float(x):
      try:
          f = float(x)
          if math.isnan(f):
              return 0.0
          return f
      except:
          return 0.0
      
    def similarRecipe(query, top_k=1):
      print("Encoding user query...")
      qEmbedding = model.encode([query]).astype("float32")#user ingre.. into number

      print("Searching FAISS...")
      dis, ind = index.search(qEmbedding, top_k)#searching from already encoded csv file's ingred.. number

      print("Indices:", ind[0])
      print("Distance:", dis[0])#it should be minimum; good res

      results = df.iloc[ind[0]].copy()
      results["similarity"] = dis[0]#cosine sim

      return results
    
    
    data = request.get_json()

    if not data or "ingredients" not in data:
        return jsonify({"error": "Provide 'ingredients'"}), 400

    user_query = data["ingredients"]

    results = similarRecipe(user_query)

    if results is None or len(results) == 0:
        return jsonify({"error": "No recipe found"}), 404

    top_recipe = results.iloc[0]

    similarity_score = converting_float(top_recipe.get("similarity", 0.0))#because stored as float in .npy file

    food_name = top_recipe.get("name", "Unknown Recipe")
    time_taken = int(top_recipe.get("minutes", 0))
    raw_ingredients = top_recipe.get("ingredients", "[]")
    steps_to_make = top_recipe.get("steps", "[]")

    try:
        ingredients = ast.literal_eval(raw_ingredients)#into list
    except:
        ingredients = [raw_ingredients]

    try:
        steps = ast.literal_eval(steps_to_make)#into numbered list
    except:
        steps = [steps_to_make]

    return jsonify({
        "recipe_name": food_name,
        "cook_time_minutes": time_taken,
        "similarity_score": float(similarity_score),
        "ingredients": ingredients,
        "steps": steps,
    })