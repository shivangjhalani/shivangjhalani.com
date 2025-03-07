---
title: Gradient Descent in Go
description: 
slug: 
date: 2025-01-03 13:22:58+0530
image: 
tags:
  - golang
categories:
  - ML
weight: 0
toc: true
readingTime: true
comments: true
math: true
hidden: true
---
## Motivation
I started the Machine Learning specialisation by Andrew Ng on coursera, and while I find the videos very interesting, the optional jupyter notebook labs were not as engaging, and already given all the code didn't seem fun at all!  
Plus I do not like python, and the added abstraction of python + numpy didn't appeal to me. 

So, I decided that rather than mindlessly staring at the jupyter notebooks, I would rather code on my own, and while I am at it, why not add a bit of a challenge and learn go at the same time as well!

## Starting our Gradient Descent
Gradient descent is an algorithm used for minimizing any function.  
### Some context
#### 1. Supervised Learning
Learning to predict outcome for some given input(s) where training is performed with correct output labels given.  
#### 2. Linear regression
A type of supervised ML. Let's say we want to best predict the value of an outcome y, given input parameter(s) x.  
For that, we have a scatter plot of a real dataset using which we are going to have the computer generalize and build a pattern which will help it predict the outcome y. More specifically the pattern here will be a straight line (in this case since we are focusing on linear regression), and we have to optimize the straight line so that it bet fits the given data.  
Now when we get the straight line through some algorithm(for example gradient descent), we can use this line to predict outcomes for even the parameter input values which were not originally present in our dataset.  
Its like saying if a house of `100sqft` costs `$1000`, and a house of `300sqft` costs nearly `$3000`, then the best fit line would suggest a house of size `200sqft` should cost `$2000`.

### The Math
#### Single Linear Regression
According to the data (hypothetical for now) with a single input parameter x and actual output y represented by the ordered pair $(x, y)$, let's say we have decided that we want to go for linear regression since a straight line will seem to fit well.

$$
f(x) = wx + b
$$

Let's say the best fit line is this, where `x` is the input parameter and `f(x)` = $\hat{y}$ is the predicted outcome, represented by the ordered pair $(x, \hat{y}$).  `f(x)` is also known as the model function or the hypothesis function.  
`w` = weight / slope of the best fit line  
`b` = bias / intercept of the best fit line

In order to get the best fit line, `w` & `b` are the two values we need to figure out. So how do we go on about getting the optimal values for `w` and `b`.  

First we will need a benchmark to tell how good the chosen values of `w` & `b` are.  
This is where the cost function $J(w,b)$ comes in.

##### Cost function
For best fit