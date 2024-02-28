# Validating Correctness

## Importance of validation

AI assistants have a problem called _hallucination_, where they make quite confident assertions of the correctness of statements, when in fact they are completely fictitious. They are also a relatively new technology. 

For this reason, we have gone to some trouble to validate that Ansari gives factually correct answers. 

## BATIK v1 

BATIK (Broad Automated Test of Islamic Knowledge) is a set of 100 questions and answers written to test Ansari particularly. The questions are factual questions extracted from the set of the first 2500 questions people have asked Ansari. It is a multiple choice quiz with each question having between 2 and 5 choices. 

### Questions

The questions can be found in this [csv file](https://github.com/waleedkadous/ansari-backend/blob/main/evals/batik/batik-v1.csv).

A cut-down version of the BATIK questions for humans (with all the Qur'an search questions removed, e.g. "Which verse of the Qur'an tells us how many angels are guardians over hell?", since that would be difficult for a human to answer) can be found [here](https://quizizz.com/join?gc=83764841). 

### Results

On the full Batik v1 set, Ansari gets **96%**. However there is some variation between runs and it could be anywhere between 94 and 97% depending on the run. 

On the human cut down version of Batik v1, Ansari gets **83 out of 86**. 

### Additional experiments

OpenAI has two models available GPT-3.5 (cheaper, simpler, faster) and GPT-4 (more costly, more complex, slower). Ansari is based on GPT-4. If we switch Ansari to be based on GPT-3.5 its accuracy **falls to 77%**. In other words _using the most advanced Large Language Models makes a material difference to the accuracy of the results_. GPT-3.5 should **not** be used to answer questions about Islam. 

We also compared Ansari with vanilla GPT-4. We found there was not a significant difference on multiple choice question results, with vanilla GPT-4 obtaining results in the 94-97% range. However, this does not mean GPT-4 and Ansari are the same; just that in multiple choices the difference doesn't show up. For example, we have seen far less errors in the text of hadith with Ansari, but that is hard to capture in a multiple choice text. 

## Dar ul Qasim examinations

[Darul Qasim](https://darulqasim.org/) is an institute based in Chicago focused on providing authentic Islamic education. Ansari took two final exams to two courses (with minor modifications to the test to accommodate formating and how AIs process data). We can not share these exams or the modified version publicly, but please contact us at [feedback@ansari.chat](mailto:feedback@ansari.chat) and we will work with Darul Qasim to give individuals access. 

Note that Ansari had no access to the course materials. We did not index the course materials, and so there were certain questions (e.g. "What tafseers did I recommend in class?") that Ansari simply could not answer. These are "zero shot" answers. 

### Course 1: Introduction to Qur'an and Theology (PCS 131)

**Course description**: This course is designed to present students with an overview of the Qurʾānic sciences which includes the preservation of the Qurʾān through generations, abrogations, Qurʾānic readings, and interpretations.

#### Results

On the Qur'an portion of the course, Ansari achieved **80%**. 

On the Theology portion of the course, Ansari achieved **78%**. 

## Ramadan validation

To prepare for the month of Ramadan, we generated a list of 34 questions across a variety of topics (Fiqh, Spirituality, Qur'an and Seerah). We also tried single turn, multi turn and generative capabilities. We rated answers on a 1 to 5 point scale, we also had a set of flags: helpful, references used, hallucination, toxic answer. 

Special thanks to Wael Hamza who led this effort as well as Saifeldeen Hadid and Iman Sadreddin for their help with this. 

### Results

- On a 5 point scale, Ansari scored 4.41 overall. 
- in 33 out of 33 ratings (100%) it was helpful (one was "not set"). 
- It used references on 26 out of 32 questions (82%). It did not use references on 6 questions, and there were 2 "no ratings." 
- There were 0 instances of hallucination detected.  
- There were 0 instances of toxic language usage. 

### Data

You can find the csv file of questions and ratings in this [csv file](https://github.com/waleedkadous/ansari-backend/blob/api-v2/evals/ramadan/questions_answers_eval.csv). 

We have generated a human version of the report [here](ramadan-results.md). 