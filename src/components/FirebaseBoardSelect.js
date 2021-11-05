import React, { useState, useEffect } from 'react';
import { Button, Dropdown, Form, FloatingLabel, Modal, Pagination, ListGroup, Spinner} from 'react-bootstrap';
import { collection, query, orderBy, startAfter, limit, getDocs, getFirestore } from "firebase/firestore"; 
import { Container, Row, Col, Card } from 'react-bootstrap';

function FirebaseBoardSelect({setVisible, startFirebaseBoard}) {
    const [currentDocs, setCurrentDocs] = useState(null);
    const [lastVisible, setLastVisible] = useState(null);

    
    useEffect(() => {
      let mounted = true;
      if(currentDocs !== null) return () => mounted = false;
      
      async function GetC(){
        const db = getFirestore();
        // Query the first page of docs
        const firstDoc = lastVisible === null ? query(collection(db, "GameBoards"), orderBy("size"), limit(10)) : query(collection(db, "GameBoards"), orderBy("size"), startAfter(lastVisible), limit(10));
        const genDocs = await getDocs(firstDoc);
        if(mounted){
          // Get the last visible document
          const lastVis = genDocs.docs[genDocs.docs.length-1];
          if(genDocs.docs[0] == null || genDocs.docs[0] == undefined){
            setLastVisible(null);
            setCurrentDocs(null);
            return () => mounted = false;
          }
          setCurrentDocs(genDocs);
          setLastVisible(lastVis);
        }
      }
      GetC();

      return () => mounted = false;
    }, [currentDocs, lastVisible]);

    function StartChallenge(challengeObj){
      setVisible(false);
      startFirebaseBoard(challengeObj);
    }

    function rowOfTiles(id, rowObj) {
      return (
        <ListGroup.Item action onClick={() => StartChallenge(rowObj)} key={id}>
          {rowObj.id}
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

    function nextPage(){
      if(lastVisible === null || lastVisible === undefined){
        setLastVisible(null);
      }
      setCurrentDocs(null);
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
                <Button variant="outline-primary" onClick={() => nextPage()}>Next Page</Button>
                {ShowContents()}
              </nav>
             }
        </div>
    );
  }
  
  export default FirebaseBoardSelect;
  