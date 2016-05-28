# concurrent-process
A test in concurrent node, pure functions and fun!

To demonstrate my understanding of node.js, particularly concurrent node I created this little app that demonstrates several node processes being created and destroyed along with the idea of node processes as disposable pure functions. The Idea is that if we construct our node apps in a way where heavy lifting can be done asyncrounously then it can be done in a forked process. Then if it can be done in a forked process we can further scale the application to create multiple instances of that process by making that process only depend on its inputs. If it only depends on its inputs then it can be run on any core, on any machine as many times as you want without causing any side effects. 

## Running
To run the app just make sure to get node `6.2.0` and run `npm install` and then `node index.js`.
# concurrent-process
A test in concurrent node, pure functions and fun!

To demonstrate my understanding of node.js, particularly concurrent node I created this little app that demonstrates several node processes being created and destroyed along with the idea of node processes as disposable pure functions. The Idea is that if we construct our node apps in a way where heavy lifting can be done asyncrounously then it can be done in a forked process. Then if it can be done in a forked process we can further scale the application to create multiple instances of that process by making that process only depend on its inputs. If it only depends on its inputs then it can be run on any core, on any machine as many times as you want without causing any side effects. 

## Running
To run the app just make sure to get node `6.2.0` and run `npm install` and then `node index.js`.
