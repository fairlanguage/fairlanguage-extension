# 1/16/19

- TODO: TOOLBAR: logo without transparency!
- TODO: REMOVE DETECTED ELEMENTS from store when mail is closed or sent

- added toolbar component
- fixed google mail multi tabs

# 1/15/19

(x) - state management for multiple tabs
!!! ALWAYS KEEP IMMUTIBILITY IN REDUX REDUCERS !!!

remaining problem in google mail:
if you switch to another tab and go back a new one widget is created.
MEANING the check in App doenst work probably!!
MEANING the element has been modified
-> need a better check here!

-> SIMPLY LOOK FOR A WIDGET ELEMENT :)

# 1/11/19

(o) - optional functional modular custom widget placing (App.js)
-> Takes in the text container element and the widget container element