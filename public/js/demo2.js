x = [];
y = [];
t = [];
document.addEventListener("mousemove", e => {
  x.push(e.clientX);
  y.push(e.clientY);
  t.push(e.timeStamp);
});

var firestore = firebase.firestore();

const visitRef = firestore.collection("websitedata").doc("visits");

var clientId = firestore.jT.clientId;
const mouseDataRef = firestore.collection("mousedata").doc(clientId);

var increment = firebase.firestore.FieldValue.increment(1);

visitRef
  .update({
    count: increment
  })
  .then(() => {
    console.log("Success");
  })
  .catch(error => {
    console.log("Failure", error);
  });

window.onbeforeunload = () => {
  mouseDataRef.set({
    x,
    y,
    t
  });
};
