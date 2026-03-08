import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score

#page configuration
st.set_page_config(
    page_title="Calorie Optimizer ~ A Smart Food Waste Reduction System",
    #page_icon="",
    layout="wide",
    initial_sidebar_state="expanded"
)

#css
st.markdown("""
<style>
    /* background*/
    .main {
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        color: white;
    }

    /* metric cards */
    div[data-testid="stMetric"] {
        background: rgba(255, 255, 255, 0.05) !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        padding: 20px !important;
        border-radius: 24px !important;
        backdrop-filter: blur(15px);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    
    div[data-testid="stMetric"]:hover {
        transform: translateY(-8px) scale(1.02);
        background: rgba(255, 255, 255, 0.08) !important;
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
        border-color: rgba(56, 189, 248, 0.4) !important;
    }

    /* Progress Bars */
    .bar-container {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        height: 12px;
        width: 100%;
        margin-top: 10px;
        overflow: hidden;
    }
    .bar-fill {
        height: 100%;
        border-radius: 20px;
        transition: width 1s ease-in-out;
    }

    /* Utility Bar: Green -> Yellow -> Red */
    .util-gradient { background: linear-gradient(90deg, #22c55e, #eab308, #ef4444); }
    /* Waste Bar: Red Glow */
    .waste-gradient { background: linear-gradient(90deg, #f87171, #dc2626); box-shadow: 0 0 10px rgba(220, 38, 38, 0.5); }
    /* Efficiency Bar: Sky Blue Glow */
    .eff-gradient { background: linear-gradient(90deg, #38bdf8, #2563eb); box-shadow: 0 0 10px rgba(56, 189, 248, 0.5); }

    /*Sidebar */
    [data-testid="stSidebar"] { background-color: #0f172a; }
    
    /* Responsive adjustment for Mobile */
    @media (max-width: 640px) {
        .main { padding: 1rem; }
        div[data-testid="stMetric"] { margin-bottom: 15px; }
    }
</style>
""", unsafe_allow_html=True)

#loading data
try:
    data = pd.read_csv("food_demand_dataset.csv")
    data['Date'] = pd.to_datetime(data['Date'])
except FileNotFoundError:
    st.error("Dataset not found. Please ensure 'food_demand_dataset.csv' exists.")
    st.stop()

# sidebar
with st.sidebar:
    st.markdown("### Calorie Optimizer")
    people_expected = st.slider("Expected People", 10, 500, 120)
    temperature = st.slider("Temperature (°C)", 15, 45, 30)
    weekend = st.segmented_control("Weekend Event?", ["No", "Yes"], default="No")
    previous_waste = st.slider("Previous Waste (plates)", 0, 50, 10)

weekend_value = 1 if weekend == "Yes" else 0

# linear regression
X = data[["People", "Temperature", "Weekend"]]
y = data["Food_Prepared"]
model = LinearRegression().fit(X, y)

input_array = np.array([[people_expected, temperature, weekend_value]])
predicted_food = int(model.predict(input_array)[0])
recommended_food = max(0, predicted_food - int(previous_waste * 0.5))
predicted_waste = max(recommended_food - people_expected, 0)
efficiency = int(((recommended_food - predicted_waste) / recommended_food) * 100) if recommended_food > 0 else 0
waste_pct = min(int((predicted_waste / recommended_food) * 100), 100) if recommended_food > 0 else 0
utilization_pct = max(0, 100 - waste_pct)

# header
st.title("Calorie Optimizer")
st.markdown("<p style='color:#94a3b8; font-size:1.1rem;'>Smart Resource Orchestration & Demand Prediction</p>", unsafe_allow_html=True)

# dashboard
st.subheader("Insights")
c1, c2, c3, c4 = st.columns(4)

with c1:
    st.metric("Expected Guests", people_expected)

with c2:
    st.metric("Recommended Prep", f"{recommended_food} Plates")
    st.markdown(f'<div class="bar-container"><div class="bar-fill util-gradient" style="width:{utilization_pct}%"></div></div>', unsafe_allow_html=True)

with c3:
    st.metric("Predicted Waste", f"{predicted_waste} Plates")
    st.markdown(f'<div class="bar-container"><div class="bar-fill waste-gradient" style="width:{waste_pct}%"></div></div>', unsafe_allow_html=True)

with c4:
    st.metric("Efficiency Score", f"{efficiency}%")
    st.markdown(f'<div class="bar-container"><div class="bar-fill eff-gradient" style="width:{efficiency}%"></div></div>', unsafe_allow_html=True)

st.markdown("---")

#analytics
col_left, col_right = st.columns([2, 1])

with col_left:
    tab1, tab2, tab3 = st.tabs(["Demand Prediction", "Waste Trends", "Correlation"])

    with tab1:
        fig1 = px.scatter(
            data, x="People", y="Food_Prepared", trendline="ols",
            title="Food Demand Linear Regression", color_discrete_sequence=["#21d548"]
        )
        fig1.update_layout(plot_bgcolor="white", hovermode="x unified")
        st.plotly_chart(fig1, use_container_width=True)

    with tab2:
        fig2 = px.line(
            data, x="Date", y="Waste", markers=True,
            title="Daily Waste Trend Over Time", line_shape="spline"
        )
        st.plotly_chart(fig2, use_container_width=True)

    with tab3:
        numeric_data = data.select_dtypes(include=np.number)
        corr = numeric_data.corr()
        fig3 = px.imshow(
            corr, text_auto=True, color_continuous_scale='RdBu_r',
            title="Feature Correlation"
        )
        st.plotly_chart(fig3, use_container_width=True)

with col_right:
    st.subheader("Kitchen Preparation Plan")
    menu = {"Rice": 0.6, "Dal": 0.5, "Roti": 2, "Dessert": 0.3}
    for item, ratio in menu.items():
        st.markdown(f"🔹 **{item}**: `{int(recommended_food*ratio)}` units")

    st.markdown("<br>", unsafe_allow_html=True)
    st.subheader("Next-Day Forecast")
    f_people = people_expected + 10
    f_food = int(model.predict(np.array([[f_people, temperature, weekend_value]]))[0])
    
    st.write(f"Guests: **{f_people}** | Prep: **{f_food}**")
    # Mini progress bar
    st.markdown(f'<div class="bar-container" style="height:6px;"><div class="bar-fill eff-gradient" style="width:75%"></div></div>', unsafe_allow_html=True)

# alert
st.subheader("Alerts")
if predicted_waste > 40:
    st.error("**High Waste Risk:** Predicted surplus exceeds safety threshold. Reduce batch size.")
elif predicted_waste > 20:
    st.warning("**Moderate Surplus:** Monitor plate distribution closely.")
else:
    st.success("**Optimal Efficiency:** Kitchen resources are perfectly balanced.")


y_pred = model.predict(X)
r2 = r2_score(y, y_pred)
print("R2 Score:", r2*100)

st.markdown("<br><hr><center style='color:#64748b; font-size:0.8rem;'>POWERED BY GEMINI AI • PROMOTING SUSTAINABILITY • PREVENTING WASTE</center>", unsafe_allow_html=True)