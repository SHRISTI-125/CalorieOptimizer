from sentence_transformers import SentenceTransformer
import numpy as np
import pickle

foodName_Dictionary = { 
    "apple_pie","baby_back_ribs","baklava","beef_carpaccio","beef_tartare",
    "beet_salad","beignets","bibimbap","bread_pudding","breakfast_burrito",
    "bruschetta","caesar_salad","cannoli","caprese_salad","carrot_cake",
    "ceviche","cheese_plate","cheesecake","chicken_curry",
    "chicken_quesadilla","chicken_wings","chocolate_cake","chocolate_mousse",
    "churros","clam_chowder","club_sandwich","crab_cakes","creme_brulee",
    "croque_madame","cup_cakes","deviled_eggs","donuts","dumplings","edamame",
    "eggs_benedict","escargots","falafel","filet_mignon","fish_and_chips",
    "foie_gras","french_fries","french_onion_soup","french_toast",
    "fried_calamari","fried_rice","frozen_yogurt","garlic_bread","gnocchi",
    "greek_salad","grilled_cheese_sandwich","grilled_salmon","guacamole",
    "gyoza","hamburger","hot_and_sour_soup","hot_dog","huevos_rancheros",
    "hummus","ice_cream","lasagna","lobster_bisque","lobster_roll_sandwich",
    "macaroni_and_cheese","macarons","miso_soup","mussels","nachos","omelette",
    "onion_rings","oysters","pad_thai","paella","pancakes","panna_cotta",
    "peking_duck","pho","pizza","popcorn","pork_chop","poutine","prime_rib",
    "pulled_pork_sandwich","ramen","ravioli","red_velvet_cake","risotto",
    "samosa","sashimi","scallops","seaweed_salad","shrimp_and_grits",
    "spaghetti_bolognese","spaghetti_carbonara","spring_rolls","steak",
    "strawberry_shortcake","sushi","tacos","takoyaki","tiramisu",
    "tuna_tartare","waffles"
}

food_list = list(foodName_Dictionary)


embedder = SentenceTransformer('all-MiniLM-L6-v2')#this model has 384 dimensions; using nlp to look similarities among words
processed_foods = [f.replace("_", " ") for f in food_list]

food_embeddings = embedder.encode(processed_foods)

with open("food_embeddings.pkl", "wb") as f:
    pickle.dump((food_list, food_embeddings), f)

print("Embeddings saved!")
