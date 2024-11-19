
import { ethers } from "ethers";
function Home({redirection : any}) {
    const connect = async () => {
        let signer = null;
        let provider;
    
        if (!window.ethereum) {
          console.log("MetaMask not installed; using read-only defaults");
          provider = ethers.getDefaultProvider();
        } else {
          console.log("MetaMask detected");
          provider = new ethers.BrowserProvider(window.ethereum);
    
          try {
            // Request account access
            await provider.send("eth_requestAccounts", []);
            signer = await provider.getSigner();
            console.log("Connected with signer:", signer);
          } catch (error) {
            console.error("User rejected connection", error);
          }
        }
      };
    return(
        
        <div>
            <button onClick={connect}>Connect to MetaMask</button>
        </div>
)
}
export default Home;