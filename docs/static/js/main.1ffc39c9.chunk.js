(this["webpackJsonpsmooth-tension"]=this["webpackJsonpsmooth-tension"]||[]).push([[0],{102:function(e,t,n){"use strict";n.r(t);var i=n(1),r=n(0),s=n.n(r),c=n(24),o=n.n(c),a=(n(69),n(70),n(20)),l=n(9),d=n(59);function u(e){var t=e.children;return Object(i.jsx)("div",{className:"mt-2 mb-2 text-xl pb-3 px-8 py-3 font-semibold  bg-red-500 text-coolGray-100 ",children:t})}function m(e){var t=e.children;return Object(i.jsx)("div",{className:"mt-2 mb-2 text-xl px-8 py-3 font-semibold rounded-full bg-blue-500 text-coolGray-100 ",children:t})}var b=n(50),j=n(121),x=n(120);function p(){var e=Object(b.a)(["\n  display: flex;\n  flex-direction: column;\n  align-items: left;\n\n  width: 80%;\n\n  border-radius: 5%;\n  overflow: auto;\n"]);return p=function(){return e},e}function h(e){var t=e.onComplete,n=e.completedList,r=e.actionList,s=e.valueList;function c(e){var n=e.target.name;e.target.checked&&t(n)}return Object(i.jsx)("div",{className:" w-full p-8  flex justify-center font-sans",children:Object(i.jsxs)("div",{className:"rounded bg-gray-200 w-64 p-2 shadow-xl",children:[Object(i.jsx)("div",{className:"flex flex-col py-1 items-center",children:Object(i.jsx)("h3",{children:"Get Spins"})}),r.map((function(e,t){var o,a=r[t],l=s[t];return Object(i.jsxs)("div",{className:"bg-white p-2 rounded mt-1 border-b border-gray cursor-pointer hover:bg-grey-lighter",children:[Object(i.jsx)(j.a,{value:"start",label:a,disabled:(o=a,n.includes(o)),name:a,control:Object(i.jsx)(x.a,{color:"primary",onChange:c})}),Object(i.jsxs)("div",{className:" w-full justify-center pb-2",children:["value: ",l]})]},a)}))]})})}n(37).a.div(p());var f=n(34),g=n(7),O=n(19),v=n(39),A=n.n(v);function y(e,t){return Object(g.a)(e,(function(n){switch(t.type){case"UPDATE_SEED":return n.seed=A()(n.seed)(),n;default:return e}}))}function N(e){var t=e.min,n=e.max,i=e.seed,r=A()(i)()*(n-t+1)+t;return Math.floor(r)}function E(e){var t=1e3*e.probabilityOfTrue;return N({min:1,max:1e3,seed:e.seed})<t}function S(e){return{seed:e}}function T(e){var t=w(e).isFinalActionAvailable,n=Object.keys(e.currentSettings.userActionsValueDictionary.oneTimeActions);return t?n.concat(e.finalAction):n}function w(e){var t=Math.floor(e.progressAmount/20)+e.userActionPoints,n=t-e.pointsUsed,i=function(e){var t=e.state,n=e.property,i=t["previous_"+n];return"undefined"===typeof i?t[n]:i}({state:e,property:"totalReward"}),r=e.totalReward-i;if(n<0)throw new Error("Used more points then available");var s=Object.keys(e.userActions).filter((function(t){return!e.userActions[t].isComplete})).length;return{totalPoints:t,pointsRemaining:n,previousTotalReward:i,actionsRemaining:s,lastReward:r,isActivityComplete:e.totalReward>0&&!e.isWaitingToHideWheel,hasRecentlyWon:r>0,isSpinningDisabled:n<1||e.isWaitingToHideWheel,isFinalActionAvailable:0===s,hasReceivedOpeningReward:e.openingRewardAmount>0}}function R(e){return Object(g.a)(e,(function(t){var n=function(e){var t=e.state,n=e.probabilityDecimal;return{newState:y(t,{type:"UPDATE_SEED"}),shouldGiveRandomReward:C({probabilityDecimal:n,seed:t.seed})}}({state:Object(g.a)(e,(function(t){t.isRandomRewardChecked=!0,t.previousRewardForOpeningTimeSinceEpoch=e.timeSinceEpochMS})),probabilityDecimal:e.currentSettings.openingRewardProbability}),i=n.newState,r=n.shouldGiveRandomReward;return Object(g.a)(i,(function(t){r&&(t.shouldReceiveOpeningReward=!0,t.openingRewardAmount+=e.currentSettings.openRewardValue,t.userActionPoints+=e.currentSettings.openRewardValue)}))}))}function C(e){return E({probabilityOfTrue:e.probabilityDecimal,seed:e.seed})}function I(e,t){return Object(g.a)(e,(function(n){var i=Object(g.a)(e,(function(e){return e}));switch(t.type){case"HANDLE_UNRELIABLE_TIME_TICK":return i=I(i,{type:"HANDLE_SKIPPED_TICKS",timeSinceEpochMS:t.timeSinceEpochMS,timeFunctionDictionary:t.timeFunctionDictionary}),t.timeSinceEpochMS-e.timeSinceEpochMS>=e.millisecondsPerTick&&(i=I(i,{type:"HANDLE_TIME_TICK",timeSinceEpochMS:t.timeSinceEpochMS,timeFunctionDictionary:t.timeFunctionDictionary})),i;case"HANDLE_TIME_TICK":i=Object(g.a)(e,(function(e){e.millisecondsPassed+=e.millisecondsPerTick}));for(var r=t.timeFunctionDictionary,s=0;s<n.intervalEvents.length;s++)i=P(i,r,s);for(s=0;s<n.oneTimeEvents.length;s++)i=D(i,r,s);return i;case"HANDLE_SKIPPED_TICKS":i=Object(g.a)(e,(function(e){e.timeSinceEpochMS=t.timeSinceEpochMS}));var c=function(e){var t=e.realTime,n=e.timerState,i=function(e){var t=e.realTime,n=e.tickInterval,i=e.startTime,r=e.expectedTimePassed;if(0===n)throw Error("tick interval must be greater than 0");var s=t-i-r;return Math.floor(s/n)-1}({realTime:t,tickInterval:n.millisecondsPerTick,startTime:n.startTime,expectedTimePassed:n.millisecondsPassed});return Math.max(i,0)}({realTime:t.timeSinceEpochMS,timerState:e});for(s=0;s<c;s++)i=I(i,{type:"HANDLE_TIME_TICK",timeFunctionDictionary:t.timeFunctionDictionary});return i;case"SET_EVENT_INTERVAL":var o=n.intervalEvents.reduce((function(e,n,i){return n.id===t.eventId?i:e}),null);n.intervalEvents[o].intervalMilliseconds=t.newInterval;break;case"ADD_INTERVAL_EVENT":n.intervalEvents.push(t.intervalEvent);break;case"ADD_ONE_TIME_EVENT":n.oneTimeEvents.push(t.oneTimeEvent);break;default:return e}}))}function D(e,t,n){return Object(g.a)(e,(function(i){var r=e.oneTimeEvents[n];if(r.isCompleted)return e;if(e.millisecondsPassed>=r.runTime){var s=Object(g.a)(e,(function(e){e.oneTimeEvents[n].isCompleted=!0}));return(0,t[r.functionName])(s)}}))}function P(e,t,n){return Object(g.a)(e,(function(i){var r=e.intervalEvents[n],s=r.lastIncrementTime+r.intervalMilliseconds;if(e.millisecondsPassed>=s){var c=Object(g.a)(e,(function(e){e.intervalEvents[n].lastIncrementTime=e.millisecondsPassed}));return(0,t[r.functionName])(c)}}))}function G(e,t){var n=I(y(e,t),t);return Object(g.a)(n,(function(i){switch(t.type){case"SET_PROGRESS_INCREMENT_SPEED":return G(Object(g.a)(n,(function(e){e.speedMultiplier=t.speedMultiplier})),{type:"SET_EVENT_INTERVAL",eventId:"UPDATE_PROGRESS_ID",newInterval:n.defaultIncrementInterval/t.speedMultiplier});case"INCREASE_PROGRESS_INCREMENT_SPEED":return G(e,{type:"SET_PROGRESS_INCREMENT_SPEED",speedMultiplier:e.speedMultiplier+t.amount});case"DECREASE_PROGRESS_INCREMENT_SPEED":return G(e,{type:"SET_PROGRESS_INCREMENT_SPEED",speedMultiplier:e.speedMultiplier-t.amount});case"USE_A_POINT":return G(e,{type:"SET_VARIABLE",property:"pointsUsed",value:e.pointsUsed+1});case"USE_POINTS":return G(e,{type:"SET_VARIABLE",property:"pointsUsed",value:e.pointsUsed+t.amount});case"SET_CURRENT_AND_PREVIOUS_VARIABLE":i["previous_"+t.property]=i[t.property],i[t.property]=t.value;break;case"SET_VARIABLE":case"SET_OBJECT":i[t.property]=t.value;break;case"BEGIN_WAITING_FOR_REWARD":i.isWaitingForRewardWheel=!0,i.pointAnimationCount++;break;case"END_WAITING_FOR_REWARD":i.isWaitingForRewardWheel=!1;break;case"BEGIN_WAITING_TO_HIDE_REWARD_CREATOR":i.isWaitingToHideWheel=!0;break;case"END_WAITING_TO_HIDE_REWARD_CREATOR":i.isWaitingToHideWheel=!1;break;case"RESET_GAME":return k({emptyGameState:W(),gameSettings:e.currentSettings,now:t.now});case"INCREASE_POINTS":i.userActionPoints+=t.amount;break;case"COMPLETE_USER_ACTION":if(console.log({n:t.name,d:i.finalAction}),t.name===i.finalAction)return i.userActionPoints+=1,void(i.currentSettings.spinWinProbability=1);var r=Object(g.a)(n,(function(e){e.userActions[t.name].isComplete=!0}));return G(r,{type:"INCREASE_POINTS",amount:r.userActions[t.name].value});case"TOGGLE_BOOLEAN":i[t.property]=!i[t.property];break;default:return i}}))}function k(e){var t=e.emptyGameState,n=e.gameSettings,i=e.now,r=Object(l.a)(Object(l.a)({},t),{},{currentSettings:Object(l.a)({},n),progressAmount:0,seed:i,timeSinceEpochMS:i,startTime:i,isFocusModeEnabled:!0}),s=n.userActionsValueDictionary.oneTimeActions,c=Object.keys(s).reduce((function(e,t){return Object(l.a)(Object(l.a)({},e),{},Object(f.a)({},t,{isComplete:!1,value:s[t]}))}),{});return r.userActions=c,""===r.finalAction&&(r.finalAction=n.finalAction,r=R(r)),r}function W(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:5;return Object(l.a)(Object(l.a)(Object(l.a)({},S(e)),{millisecondsPassed:0,millisecondsPerTick:1e3,oneTimeEvents:[],intervalEvents:[],timeSinceEpochMS:0,startTime:0,previousTimeSinceEpochMS:0}),{},{totalReward:0,userActionPoints:0,isTimerRunning:!1,initialReward:0,isRandomRewardChecked:!1,isWaitingToHideWheel:!1,openingRewardAmount:0,progressAmount:0,defaultIncrementInterval:1e3,pointAnimationCount:0,incrementAmount:.1,speedMultiplier:1,userActions:{},finalAction:"",isWaitingForRewardWheel:!1,isVisible:!0,pointsUsed:0,previousRewardForOpeningTimeSinceEpoch:0})}var M=n(21),L=n(22),F=n(57),H=n.n(F);function B(e){e.gameState;var t=e.dispatch;return Object(i.jsx)(i.Fragment,{children:Object(i.jsx)(i.Fragment,{children:Object(i.jsx)(H.a,{bottom:!0,children:Object(i.jsxs)("div",{children:[Object(i.jsx)("section",{className:"p-6",children:Object(i.jsxs)("div",{className:"container",children:[Object(i.jsx)("span",{className:"block mb-2 text-xs font-medium tracking-widest text-center uppercase text-violet-600",children:"Training Complete"}),Object(i.jsx)("h2",{className:"text-5xl font-bold text-center text-coolGray-900",children:"Choose Your Next Step"}),Object(i.jsxs)("div",{className:"grid gap-6 my-16 lg:grid-cols-3",children:[Object(i.jsxs)("div",{className:"flex flex-col p-8 space-y-4 rounded-md bg-coolGray-50",children:[Object(i.jsx)("div",{className:"flex items-center justify-center flex-shrink-0 w-12 h-12 text-xl font-bold rounded-full bg-violet-600 text-coolGray-50",children:"a"}),Object(i.jsx)("p",{className:"text-2xl font-semibold",children:"Open the activity you would rather be doing."})]}),Object(i.jsxs)("div",{className:"flex flex-col p-8 space-y-4 rounded-md bg-coolGray-50",children:[Object(i.jsx)("div",{className:"flex items-center justify-center flex-shrink-0 w-12 h-12 text-xl font-bold rounded-full bg-violet-600 text-coolGray-50",children:"b"}),Object(i.jsx)("p",{className:"text-2xl font-semibold",children:"Take a break from technology"})]}),Object(i.jsxs)("div",{className:"flex flex-col p-8 space-y-4 rounded-md bg-coolGray-50",children:[Object(i.jsx)("div",{className:"flex items-center justify-center flex-shrink-0 w-12 h-12 text-xl font-bold rounded-full bg-violet-600 text-coolGray-50",children:"c"}),Object(i.jsx)("p",{className:"text-2xl font-semibold",children:"Block distractions with a website blocker."})]})]})]})}),Object(i.jsxs)("button",{onClick:function(){t({type:"RESET_GAME",now:Date.now()})},className:"px-8 py-3 text-lg font-normal border rounded bg-coolGray-800 text-coolGray-50 border-coolGray-700",children:[Object(i.jsx)(M.a,{icon:L.e})," Reset"]})]})})})})}var U=n(38);n(46);function V(e){var t=e.minNumber,n=e.maxNumber,i=e.isWin,r=(e.animationNumberCount,e.animationPercentMax),s=void 0===r?100:r,c=e.animationPercentMin,o=void 0===c?0:c,a=e.animationPercentStep,l=void 0===a?.1:a,d=e.seed,u=parseInt(n/2),m="Win: Number greater or equal to ".concat(u),b="Try Again: Number less than ".concat(u," "),j=E({probabilityOfTrue:.4,seed:d}),x=function(e){var t=e.minNumberToShow,n=e.maxNumberToShow,i=e.animationNumberCount,r=e.isWin,s=e.isCloseLoss,c=e.getALosingRandomNumber,o=e.getAWinningRandomNumber,a=e.seed,l=function(e){return a+e},d=function(e){var t=e.count,n=e.min,i=e.max,r=e.seed;return O.range(0,t).map((function(e,t){return N({max:i,min:n,seed:r+t})}))}({max:n,min:t,count:i,seed:l(2324)}),u=o(l(888)),m=O.dropRight(d).concat(u);if(r)return m;return function(e){var t=e.listOfNumbersToUse,n=e.isCloseLoss,i=e.winningNumber,r=e.twoLosingNumbers,s=[r[0],r[1]],c=[i,r[1]],o=function(e){return O.dropRight(t,e.length).concat(e)};if(n)return o(c);return o(s)}({listOfNumbersToUse:d,isCloseLoss:s,winningNumber:u,twoLosingNumbers:[c(a+l(33)),c(a+l(34))]})}({minNumberToShow:t,maxNumberToShow:n,animationNumberCount:(s-o)/l+1,isWin:i,isCloseLoss:j,getALosingRandomNumber:function(e){return N({max:u-1,min:t,seed:e})},getAWinningRandomNumber:function(e){return N({max:n,min:u,seed:e})},seed:d});return{winningNumberMessage:m,losingNumberMessage:b,getNumberToShowFromPercentComplete:function(e){var t=e.percentComplete,n=(e.seed,parseInt(100*t/l));return x[n]},getIsNumberAWinningNumber:function(e){return e>=u}}}var Q=function(e){var t=e.children;return Object(i.jsx)("div",{className:"rounded shadow border h-40 w-60",children:t})};function K(e){var t=e.gameState,n=e.dispatch,r=w(t).hasRecentlyWon,s=t.pointAnimationCount;return Object(i.jsx)(i.Fragment,{children:Object(i.jsx)(Q,{children:t.pointAnimationCount>0?Object(i.jsx)(q,{isWin:r,isCloseLoss:E({probabilityOfTrue:.4,seed:t.seed})&&!r,seed:t.seed,animationConfig:t.currentSettings.animationConfig,onAnimationStart:function(){},onAnimationEnd:function(){n({type:"END_WAITING_FOR_REWARD"})},onFinishedShowing:function(){n({type:"END_WAITING_TO_HIDE_REWARD_CREATOR"})}},s):null})})}function q(e){var t=e.isWin,n=e.isCloseLoss,s=e.seed,c=e.animationConfig,o=e.delayAfterLoading,a=void 0===o?1500:o,l=e.onAnimationStart,d=void 0===l?function(){}:l,u=e.onAnimationEnd,m=void 0===u?function(){}:u,b=e.onFinishedShowing,j=void 0===b?function(){}:b;return Object(r.useEffect)((function(){return d(),function(){}}),[d]),Object(i.jsx)(i.Fragment,{children:Object(i.jsx)(_,{seed:s,isWin:t,isCloseLoss:n,onAnimationEnd:function(){m(),setTimeout((function(){j()}),a)},maxNumberToShow:c.maxNumberToShow,minNumberToShow:c.minNumberToShow})})}function _(e){var t=e.isWin,n=e.seed,s=e.onAnimationEnd,c=e.maxNumberToShow,o=e.minNumberToShow,l=e.isCloseLoss,d=Object(r.useState)(!1),u=Object(a.a)(d,2),m=u[0],b=u[1],j=V({minNumber:o,maxNumber:c,isWin:t,isCloseLoss:l,animationPercentStep:.1,seed:n}),x=j.getIsNumberAWinningNumber,p=j.getNumberToShowFromPercentComplete,h=j.winningNumberMessage,f=j.losingNumberMessage;return Object(i.jsxs)(i.Fragment,{children:[Object(i.jsx)(U.Spring,{from:{number:0},to:{number:100},onRest:function(){m||(s(),b(!0))},config:{friction:25,tension:35,clamp:!0},children:function(e){var t=(100===e.number?100:Math.min(e.number,99.9))/100,r=p({seed:n,percentComplete:t});return Object(i.jsxs)(i.Fragment,{children:[Object(i.jsx)(J,{number:r,percentComplete:t,isNumberAWin:x(r)}),Object(i.jsx)(Y,{previousPercentComplete:t-.001<0?0:t-.001,percentComplete:t})]})}}),m?t?h:f:null]})}function J(e){var t=e.number,n=e.isNumberAWin,r=100*e.percentComplete>97,s=t.toString(),c=t<10?"0"+s:s;return Object(i.jsx)("div",{className:"border m-4 rounded",children:r?n?Object(i.jsx)("div",{className:"bg-green-300 rounded",children:c}):Object(i.jsx)("div",{className:"bg-red-300 rounded",children:c}):Object(i.jsx)("div",{className:"rounded",children:c})})}function Y(e){e.previousPercentComplete;var t=e.percentComplete;var n=0;if(t<=.99)n=function(e){var t=e.currentPercent,n=e.shownMax,i=e.distance,r=function(e){return e.distance*(e.currentPercent/e.maxToShow)},s={currentPercent:t,distance:i,maxToShow:n};return console.log(Object(l.a)({currentPercent:t,distance:i,maxToShow:n,x:t/n,shown:r(s)},s)),r(s)}({currentPercent:t,shownMax:.9,distance:.5});else{n=.5*(1-(1-t)/(1-.99))+.5}return Object(i.jsx)("div",{children:Object(i.jsx)("div",{className:"w-full h-5 overflow-hidden rounded-lg bg-gray-300",children:Object(i.jsx)("div",{className:"h-full  bg-blue-400",style:{width:"".concat(100*n,"%")}})})})}n(19);function z(e){var t=e.gameState,n=e.dispatch,r=(e.shouldShowPoints,w(t)),s=Object(l.a)(Object(l.a)({},t),r),c=(s.isWaitingForRewardWheel,s.totalPoints,s.pointsRemaining),o=(s.lastReward,s.isSpinningDisabled);s.totalReward;return Object(i.jsxs)("div",{children:[Object(i.jsx)("div",{children:"Spins Remaining ".concat(c)}),Object(i.jsx)("div",{children:0===c?"Get spins by completing actions below ":Object(i.jsx)("button",{disabled:o,className:"self-center px-4 py-1 rounded-full bg-blue-700 text-coolGray-50",onClick:function(){!function(e){var t=e.gameState,n=e.dispatch;n({type:"USE_A_POINT"}),n({type:"UPDATE_SEED"});var i=C({probabilityDecimal:t.currentSettings.spinWinProbability,seed:t.seed})?1:0;n((r=t.totalReward+i,{type:"SET_CURRENT_AND_PREVIOUS_VARIABLE",property:"totalReward",value:r}));var r}({dispatch:n,gameState:t}),n({type:"BEGIN_WAITING_FOR_REWARD"}),n({type:"BEGIN_WAITING_TO_HIDE_REWARD_CREATOR"})},children:"Spin Wheel"})})]})}var Z=k({now:Date.now(),emptyGameState:W(),gameSettings:{spinWinProbability:.4,openRewardValue:1,openingRewardProbability:.5,animationConfig:{minNumberToShow:1,maxNumberToShow:18},finalAction:"Final Action: Hold for 15 more seconds to show you can handle discomfort",userActionsValueDictionary:{oneTimeActions:{"Close distracting websites":2,"Identify next action":2,"Rember your values: Why are you doing this?":1}}}});function X(e){var t=e.state,n=void 0===t?Z:t,s=Object(r.useState)(n),c=Object(a.a)(s,2),o=c[0],l=c[1];function u(e){l((function(t){return G(t,e)}))}return Object(i.jsxs)(i.Fragment,{children:[Object(i.jsx)(d.a,{onChange:function(e){u(e?{type:"SET_VARIABLE",property:"isVisible",value:!0}:{type:"SET_VARIABLE",property:"isVisible",value:!1})}}),Object(i.jsx)($,{gameState:o,dispatch:u})]})}function $(e){var t=e.gameState,n=e.dispatch,r=w(t);return Object(i.jsx)(i.Fragment,{children:Object(i.jsxs)("div",{className:"flex flex-col items-center justify-between h-full",children:[Object(i.jsx)(ne,{shouldRelease:r.lastReward>0&&!t.isWaitingForRewardWheel}),Object(i.jsx)(K,{gameState:t,dispatch:n}),Object(i.jsx)(ee,{gameState:t}),r.isActivityComplete?Object(i.jsx)(B,{gameState:t,dispatch:n}):Object(i.jsxs)(i.Fragment,{children:[Object(i.jsx)(z,{gameState:t,dispatch:n,shouldShowPoints:!t.isWaitingForRewardWheel}),Object(i.jsx)(te,{gameState:t,dispatch:n})]})]})})}function ee(e){var t=e.gameState,n=w(t),r=Object(l.a)(Object(l.a)({},t),n),s=r.isActivityComplete,c=r.openingRewardAmount,o=r.hasReceivedOpeningReward;return!s&&o?Object(i.jsxs)("div",{children:["Free Spins Won By Opening App: ",c]}):null}function te(e){var t,n=e.gameState,r=e.dispatch,s=T(n),c=s.filter((function(e){return!(e===n.finalAction)&&n.userActions[e].isComplete})),o=T(t=n).map((function(e){return e===t.finalAction?0:function(e){var t=e.state,n=e.itemName;return t.currentSettings.userActionsValueDictionary.oneTimeActions[n]}({state:t,itemName:e})}));return Object(i.jsx)(i.Fragment,{children:Object(i.jsx)("div",{className:"pt-4",children:Object(i.jsx)(h,{actionList:s,completedList:c,valueList:o,onComplete:function(e){r({type:"COMPLETE_USER_ACTION",name:e})}})})})}function ne(e){return e.shouldRelease?Object(i.jsx)(i.Fragment,{children:Object(i.jsx)(m,{children:Object(i.jsx)("h2",{children:"Release Tension"})})}):Object(i.jsx)(i.Fragment,{children:Object(i.jsx)(u,{children:Object(i.jsx)("h2",{children:"Hold Tension"})})})}function ie(e){var t=e.children,n=e.width,r=void 0===n?"100%":n,c=e.spacing,o=void 0===c?1:c;e.align;return Object(i.jsx)("div",{style:{width:r,display:"flex",placeItems:"center",flexDirection:"column"},children:s.a.Children.map(t,(function(e){var t={style:{margin:o}};return s.a.isValidElement(e)?s.a.cloneElement(e,t):e}))})}function re(e){var t=e.onLearnMoreClick,n=e.onNextPageClick,s=e.onQuickStartClick,c=Object(r.useState)(!1),o=Object(a.a)(c,2),l=(o[0],o[1],Object(i.jsx)("section",{className:"py-6 bg-coolGray-100 text-coolGray-900",children:Object(i.jsxs)("div",{className:"mx-auto container flex flex-col items-center justify-center p-4 space-y-8 md:p-10 md:px-24 xl:px-48",children:[Object(i.jsx)("h1",{className:"text-4xl font-bold leading-none text-center",children:"Build your willpower"}),Object(i.jsxs)("ul",{className:" text-xl font-medium pl-2 ml-8 text-left  list-inside",children:[Object(i.jsx)("li",{className:"pb-1",children:"Live your values "}),Object(i.jsx)("li",{className:"pb-1",children:"Master discomfort"}),Object(i.jsx)("li",{className:"pb-1",children:"Replace addictive software with mindfulness"})]}),Object(i.jsxs)("div",{className:"flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:space-x-8",children:[Object(i.jsx)("button",{onClick:function(){n()},className:"px-8 py-3 text-lg font-semibold rounded bg-blue-600 text-coolGray-50",children:"Get started"}),Object(i.jsx)("button",{onClick:function(){t()},className:"px-8 py-3 text-lg font-normal border rounded bg-coolGray-800 text-coolGray-50 border-coolGray-700",children:"Learn more"})]})]})}));return Object(i.jsxs)("div",{classNameName:" min-h-screen  py-6 flex justify-center sm:py-12",children:[Object(i.jsx)("div",{className:"p-4 w-full bg-coolGray-100 text-coolGray-800",children:Object(i.jsxs)("header",{className:"mx-auto container flex justify-between h-16 border-b-2 border-coolGray-300",children:[Object(i.jsx)("img",{alt:"Smooth tension logo",src:"data:image/png;base64,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"}),Object(i.jsx)("p",{className:"self-center px-8 py-3 text-3xl  rounded",children:"Smooth Tension"}),Object(i.jsx)("div",{className:"flex-shrink-0 hidden lg:block",children:Object(i.jsx)("button",{onClick:function(){s()},className:"self-center px-8 py-3 rounded-full bg-gray-600 text-coolGray-50",children:"Quick Start"})}),Object(i.jsx)("button",{className:"flex justify-end p-4 lg:hidden",children:Object(i.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:Object(i.jsx)("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M4 6h16M4 12h16M4 18h16"})})})]})}),l]})}function se(e){var t=e.onStartClick;return Object(i.jsxs)("div",{children:[Object(i.jsx)("section",{className:"bg-coolGray-100 text-coolGray-800",children:Object(i.jsxs)("div",{className:"m-auto container flex flex-col p-6",children:[Object(i.jsx)("h2",{className:"py-4 text-4xl font-bold text-center",children:"How Smooth Tension Works"}),Object(i.jsxs)("div",{className:"divide-y divide-coolGray-300",children:[Object(i.jsx)(ce,{stepNumber:1,sideImage:Object(i.jsx)(M.a,{icon:L.d,size:"5x"}),stepTitle:"Notice Your Actions",instructions:"Notice when you are not doing something you value. Be mindful that you want to stop mindless scrolling "}),Object(i.jsx)(ce,{stepNumber:2,sideImage:Object(i.jsx)(M.a,{icon:L.a,size:"5x"}),stepTitle:"Create Tension",instructions:"Create physical discomfort by tensing your musicales or doing a light stretch. This will give you the willpower to leave whatever is stealing your attention you."}),Object(i.jsx)(ce,{stepNumber:3,sideImage:Object(i.jsx)(M.a,{icon:L.f,size:"5x"}),stepTitle:"Open This App To Release Tension",instructions:"Train your self to hold the tension until this app tells you to release tension"}),Object(i.jsx)(ce,{stepNumber:3.5,sideImage:Object(i.jsx)(M.a,{icon:L.b,size:"5x"}),stepTitle:"Experience the Neuroscience",instructions:"This app uses many of the used in mobile games and social media to get you addicted. They convert discomfort into time spent on the site. This app will convert discomfort by making you do tasks to release the tension you created."}),Object(i.jsx)(ce,{stepNumber:4,sideImage:Object(i.jsx)(M.a,{icon:L.c,size:"5x"}),stepTitle:"Do What You Value",instructions:"After using this app you will be in the best state of mind to start doing what you actually value. Close the distracting website. Open the website you value and and get started."})]})]})}),Object(i.jsx)("button",{onClick:function(){t(!0)},className:"mb-8 px-8 py-3 text-lg font-semibold rounded bg-blue-600 text-coolGray-50",children:"Get started"})]})}function ce(e){var t=e.stepShortName,n=void 0===t?null:t,r=e.stepTitle,s=e.sideImage,c=e.instructions,o=e.stepNumber;return Object(i.jsxs)("div",{className:"grid justify-center grid-cols-4 p-8 mx-auto space-y-8 lg:space-y-0",children:[Object(i.jsx)("div",{className:"flex items-center justify-center lg:col-span-1 col-span-full",children:s}),Object(i.jsxs)("div",{className:"flex flex-col justify-center max-w-3xl text-center col-span-full lg:col-span-3 lg:text-left",children:[Object(i.jsxs)("span",{className:"text-xs tracking-wider uppercase text-blue-600",children:["Step ",o," ",n?Object(i.jsxs)(i.Fragment,{children:[" - ",n]}):null]}),Object(i.jsx)("span",{className:"text-xl font-bold md:text-2xl",children:r}),Object(i.jsx)("span",{className:"mt-4 text-coolGray-700",children:c})]})]})}function oe(e){var t=e.onNextPageClick;return Object(i.jsxs)(i.Fragment,{children:[Object(i.jsx)("section",{className:" mt-4 p-6 h-4/5",children:Object(i.jsxs)("div",{className:"container mx-auto",children:[Object(i.jsx)("h2",{className:"text-2xl font-bold text-center text-coolGray-900",children:"Convert Tension to Action"}),Object(i.jsxs)("div",{className:"grid gap-6 my-8 lg:grid-cols-3",children:[Object(i.jsxs)("div",{className:"flex flex-col p-8 space-y-4 rounded-md bg-coolGray-50",children:[Object(i.jsx)("div",{className:"flex items-center justify-center flex-shrink-0 w-12 h-12 text-xl font-bold rounded-full bg-blue-600 text-coolGray-50",children:"1"}),Object(i.jsxs)("p",{className:" ",children:[Object(i.jsx)("h3",{className:"pb-4 ",children:"Create Tension "}),Object(i.jsxs)("ul",{className:"",children:["Ideas",Object(i.jsxs)("ul",{className:"pb-2 pl-3 list-disc text-left",children:[Object(i.jsx)("li",{children:"Stretch one arm behind your back"}),Object(i.jsx)("li",{children:"Tighten your abdomen"}),Object(i.jsx)("li",{children:"Flex one of your calves"})]})]})]})]}),Object(i.jsxs)("div",{className:"flex flex-col p-8 space-y-4 rounded-md bg-coolGray-50",children:[Object(i.jsx)("div",{className:"flex items-center justify-center flex-shrink-0 w-12 h-12 text-xl font-bold rounded-full bg-blue-600 text-coolGray-50",children:"2"}),Object(i.jsx)("p",{className:"",children:"Use this app to convert tension into action."})]}),Object(i.jsxs)("div",{className:"flex flex-col p-8 space-y-4 rounded-md bg-coolGray-50",children:[Object(i.jsx)("div",{className:"flex items-center justify-center flex-shrink-0 w-12 h-12 text-xl font-bold rounded-full bg-blue-600 text-coolGray-50",children:"3"}),Object(i.jsxs)("p",{className:"",children:["Start doing what you value instead of wasting your time"," "]})]})]})]})}),Object(i.jsx)("button",{onClick:function(){t()},className:"px-8 py-3 text-lg font-semibold rounded bg-blue-600 text-coolGray-50",children:"Go"})]})}var ae=n(58),le=n(5),de="/start",ue="/main",me="/about";function be(){return Object(i.jsx)(ae.a,{children:Object(i.jsx)(pe,{children:Object(i.jsx)(je,{})})})}function je(){var e=Object(le.f)();function t(t){e.push(t)}return Object(i.jsxs)(le.c,{children:[Object(i.jsx)(le.a,{path:me,children:Object(i.jsx)(se,{onStartClick:function(){return t(ue)}})}),Object(i.jsx)(le.a,{path:de,children:Object(i.jsx)(oe,{onNextPageClick:function(){return t(ue)}})}),Object(i.jsx)(le.a,{path:ue,children:Object(i.jsx)(ie,{width:"100%",children:Object(i.jsx)(X,{})})}),Object(i.jsx)(le.a,{path:"/",children:Object(i.jsx)(re,{onNextPageClick:function(){return t(de)},onLearnMoreClick:function(){return t(me)},onQuickStartClick:function(){return t(ue)}})})]})}function xe(){return Object(i.jsx)(be,{})}function pe(e){var t=e.children;return Object(i.jsx)("div",{className:"top-0 left-0 absolute w-screen min-h-screen bg-coolGray-100",children:t})}var he=function(){return Object(i.jsx)(i.Fragment,{children:Object(i.jsx)("div",{className:"App",children:Object(i.jsx)(xe,{})})})},fe=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,122)).then((function(t){var n=t.getCLS,i=t.getFID,r=t.getFCP,s=t.getLCP,c=t.getTTFB;n(e),i(e),r(e),s(e),c(e)}))};o.a.render(Object(i.jsx)(s.a.StrictMode,{children:Object(i.jsx)(he,{})}),document.getElementById("root")),fe()},69:function(e,t,n){},70:function(e,t,n){},81:function(e,t){}},[[102,1,2]]]);
//# sourceMappingURL=main.1ffc39c9.chunk.js.map