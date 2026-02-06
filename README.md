# DISASTER-DAMAGE-ASSESSMENT-AND-RESPONSE-WEB-PLATFORM-ROLE-BASED-ACCESS-


## AIM:
The aim of this project is to design, develop, and deploy a Disaster Damage Assessment and Response Web Platform that leverages Artificial Intelligence and Geospatial Technologies to automatically analyze satellite imagery, classify damage severity, and provide role-based access for administrators, relief agents, and general users. The system aims to improve disaster response efficiency, accuracy, and coordination through centralized data management and real-time visualization.

## STEP-BY-STEP PROCEDURE:
### Step 1: Project Setup

Design system architecture and define user roles
Set up frontend using React.js
Set up backend using Django & Django REST Framework

### Step 2: Data Collection & Preprocessing

Collect satellite and geospatial data
Preprocess images (normalization, geo-referencing)
Clean and structure data for model input

### Step 3: Model Development

Train CNN-based models for damage classification
Validate and test model performance
Integrate trained model with backend APIs

### Step 4: System Integration

Connect frontend with backend APIs
Implement role-based authentication
Enable GIS map visualization and report generation

### Step 5: Testing

Perform functional, integration, and security testing
Validate outputs with sample disaster scenarios

## Hardware Selection:
Server / Cloud Hosting: AWS, GCP, or Heroku for web application and ML model deployment
Processing Unit: High-performance CPUs; GPU (NVIDIA Tesla / RTX series) for running deep learning models
Memory & Storage: Minimum 16–32 GB RAM; SSD storage for fast image processing and database operations
Networking: High-speed internet for satellite image downloads and real-time updates
User Devices: PCs, laptops, or tablets with modern browsers for accessing the web platform
## Software Selection:
Frontend: React.js, Leaflet.js (for interactive map visualization)
Backend: Django REST Framework (Python)
Database: PostgreSQL with PostGIS extension for geospatial data storage
Machine Learning Frameworks: TensorFlow or PyTorch for damage detection models
Satellite Image Sources: Google Earth Engine API or other satellite data providers
Task Management: Celery with Redis or RabbitMQ for background processing
Notification Services: Firebase, Twilio, or SendGrid for alerts via email, SMS, or push notifications
Security: SSL/TLS for secure communication, AES for data encryption, and role-based access control (RBAC)
Hosting & Deployment: Cloud-based environments (AWS EC2/S3, GCP Compute Engine)

## ARCHITECURE DIAGRAM:
<img width="1411" height="658" alt="image" src="https://github.com/user-attachments/assets/12b41cf1-61be-4c53-999b-e94951a0054d" />

## PROGRAM
### BACKEND SETTINGS.PY
<img width="897" height="779" alt="image" src="https://github.com/user-attachments/assets/9970b40a-8e14-4229-af85-f6cc71249cdf" />

### FRONTEND
### PACKAGE.LOCK.JSON
<img width="1129" height="792" alt="image" src="https://github.com/user-attachments/assets/98a7836a-75b9-40fc-bdc7-d57bf752e707" />


## RESULT:

The developed system successfully automates disaster damage assessment using satellite imagery and AI models. The platform provides accurate damage classification, interactive geospatial visualization, and secure role-based access. Response time is significantly reduced compared to manual methods, and coordination between authorities and relief teams is improved. The project demonstrates a scalable, intelligent, and real-world-ready solution suitable for academic, governmental, and disaster response applications.

