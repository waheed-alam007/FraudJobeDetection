FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

COPY backend/ /app/

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 7860

ENV ENVIRONMENT=production

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]