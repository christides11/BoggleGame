import React, { useState, useEffect } from 'react';
import { Button, Dropdown, Form, FloatingLabel, Modal, Pagination, ListGroup, Spinner} from 'react-bootstrap';
import { collection, query, orderBy, startAfter, limit, getDocs, getDoc, getFirestore, doc, where } from "firebase/firestore"; 
import { Container, Row, Col, Card } from 'react-bootstrap';

function FirebaseChallengeSelect({setVisible, startFirebaseBoard}) {
    const [currentDocs, setCurrentDocs] = useState(null);
    const [lastVisible, setLastVisible] = useState(null);
    const [dict, setDict] = useState({});

    useEffect(() => {
      let mounted = true;
      if(currentDocs !== null) return () => mounted = false;
      
      async function GetC(){
        const db = getFirestore();
        // Get Challenges
        const challengesDocRequest = query(collection(db, "Challenges"), orderBy("endDate"), limit(15));
        const challengesDoc = await getDocs(challengesDocRequest);
        if(mounted){
            const lastVis = challengesDoc.docs[challengesDoc.docs.length-1];
            const tempDict = dict;
            // Get High Scores
            for(let a = 0; a < challengesDoc.docs.length; a++){
                const highScoreRequest = query(collection(db, "LeaderBoard"), where("theBoard", "==", challengesDoc.docs[a].data().board), 
                orderBy("numFound", "desc"), orderBy("solvedTime"), limit(1));
                const hsDoc = await getDocs(highScoreRequest);
                if(hsDoc.docs.length > 0){
                    tempDict[challengesDoc.docs[a].id] = hsDoc.docs[0];
                }
            }
            setDict(tempDict);

            setCurrentDocs(challengesDoc);
            setLastVisible(lastVis);
        }
      }
      GetC();

      return () => mounted = false;
    }, [currentDocs, lastVisible, dict]);


    function StartChallenge(challengeObj){
        setVisible(false);
        const db = getFirestore();
        const docRef = doc(db, "GameBoards", challengeObj.data().board.id);
        getDoc(docRef).then((value) => {
            if(value.exists() === false) return;
            startFirebaseBoard(value);
        });
    }

    function rowOfTiles(id, rowObj) {
        return (
            <ListGroup.Item action onClick={() => StartChallenge(rowObj)} key={id} as="li" className="d-flex justify-content-between align-items-start">
                <div className="ms-2 me-auto">
                    <div className="fw-bold">{rowObj.data().name}</div>
                    High Score: { (rowObj.id in dict) && dict[rowObj.id].data().numFound }
                </div>
            </ListGroup.Item>
        );
    }

    function ShowContents(){
        return (
            <ListGroup>
              {currentDocs.docs.map((e, l, i) => {
                  return rowOfTiles(l, e);
              })}
            </ListGroup>
          );
    }

    return (
        <div className="FirebaseBoardSelect">
            {currentDocs === null &&
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            }

            {currentDocs !== null &&
              <nav>
                {ShowContents()}
              </nav>
             }
        </div>
    );
  }
  
  export default FirebaseChallengeSelect;
  