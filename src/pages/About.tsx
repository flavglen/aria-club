import { useEffect } from "react";
import { db, doc, setDoc } from "../firebase";

export const About = () => {
    function getGeolocation() {
        const obj = {latitude: 0, longitude: 0};
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const latitude = position.coords.latitude;
              const longitude = position.coords.longitude;
              obj.latitude = latitude ;
              obj.longitude = longitude
              saveToFireDB(null, obj);
            },
            (error) => {
              console.error("Error retrieving location: ", error.message);
            }
          );
        } else {
          console.error("Geolocation is not supported by this browser.");
        }

        return obj;
      }

    function getClientIP(callback) {
        const peerConnection = new RTCPeerConnection({
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" }  // Using a public STUN server
          ]
        });
      
        const noop = () => {console.log('hello')};
        const localIPs = {};
      
        peerConnection.createDataChannel('');
      
        peerConnection.onicecandidate = (event) => {
          if (!event || !event.candidate) {
            return;
          }
      
          const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/;
          const ipMatch = ipRegex.exec(event.candidate.candidate);
      
          if (ipMatch) {
            const ip = ipMatch[1];
            if (!localIPs[ip]) {
              localIPs[ip] = true;
              callback(ip);
            }
          }
        };
      
        peerConnection.createOffer()
          .then((offer) => peerConnection.setLocalDescription(offer))
          .catch(noop);
    }

    function saveToFireDB(ip,log) {
        const guestDoc = doc(db, 'guest', new Date().getTime().toString());
        setDoc(guestDoc, {ip, log, time: new Date().toLocaleString()})
    }
      
      // Usage example
      useEffect(() => {
        getClientIP((ip) => {
            saveToFireDB(ip, null);
          });
      },[])

      useEffect(() => {
        const log = getGeolocation();
      },[])
      
    return null;
}