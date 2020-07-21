# Labellr
Project 2

## Crowdsourced Data Labelling

### Motivation:
One of the many bottlenecks faced by data scientists is obtaining sufficient and accurate labelled training data as input into their models. 

Even though there is pre-labelled data readily available online, these labels may not be suited for the specific context in which the data scientists are trying to model. (e.g. “this vacuum cleaner sucks” - would this be a positive or negative sentiment?)

This app aims to provide a platform for crowdsourcing labellers to not only help label training data, but allow for users/data scientists to select different demographics to help label the data in specific contexts.

In the basic case, text content can come from restaurant reviews or forums. 

Clients here refer to data scientists who needs some training data labelled.

### References: 
- [Amazon SageMaker Ground Truth](https://aws.amazon.com/sagemaker/groundtruth/)
- [Google Captcha](https://aibusiness.com/document.asp?doc_id=760448&site=aibusiness)
- [Data Labeling Guide](https://www.cloudfactory.com/data-labeling-guide)
- [AI Platform Data Labeling Service](https://cloud.google.com/ai-platform/data-labeling/docs)

### Technologies:
- Node, Express, EJS
- Passport
- Mongo DB

### Models:
| User        | Text           | Image  |
| -------------|-------------|-----|
| Admin<br>Labeller<br>Client | textContent, length<br>labelled language<br>labelled sentiment<br>labelled topic | imageUrl<br>type of label<br>result of label |

<img src="plan/erd.png" width="400">

### MVP:
- CRUD for Text Model
- Login for Admin, Labeller and Client
- Routes for Labeller and Client
- Allow Admin to view all routes 
- Allow a labeller to label a piece of text with 
    - sentiment (1 for negative, 5 for positive, 3 for neutral

### Furthers:
- Allow labelling text with topic (e.g. pricing issue, operational issue, customer service issue)
- Allow image labelling
- Allow Clients to set up configs for their labelling - language, topics, image (e.g. is this a cat?)
- Allow labellers to select language preference or specialties
- Scoring for labellers - for compensation/gamification

### Further furthers:
- Bulk upload of text by csv or from DBs, google sheets
- Use twitter or reddit API to get sample texts
- Download of results by csv
- Convert to chat bot for labelling on the go
- Analytics for labels, stats for the labels etc
 
 https://www.techighness.com/post/node-expressjs-endpoint-to-upload-and-process-csv-file/

 https://github.com/C2FO/fast-csv/tree/master/examples/parsing-js