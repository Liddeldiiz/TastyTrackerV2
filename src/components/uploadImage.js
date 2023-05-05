function App() {
    const [imageUpload, setImagseUpload] = useState(null);
    const [imageList, setImageList] = useState([]);
    
  
    const imagesCollectionRef = collection(db, "images");
    const imageListRef = ref(storage, "images/");
  
  /*
    useEffect(() => {
      const getImageList = async () => {
        // READ THE DATA
        // SET THE IMAGE LIST
        try {
          const data = await getDocs(imagesCollectionRef);
          const filteredData = data.docs.map((doc) => ({
            ...doc.data(), 
            id: doc.id
          }));
          setImageList(filteredData);
        } catch(err) {
          console.error(err)
        }
      };
  
      getImageList();
    }, []);*/ 
    
  
    
    const uploadImage = () => {
      if (imageUpload == null) return alert("No image has been selected");
      
      const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
  
      console.log("uploading...");
      uploadBytes(imageRef, imageUpload).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          setImageList((prev) => [...prev, url]);
        })
      });
    };
  
    useEffect(() => {
      listAll(imageListRef).then((response) => {
        response.items.forEach((item) => {
          getDownloadURL(item).then((url) => {
            setImageList((prev) => [...prev, url]);
          });
        });
      });
    }, []);
  
    return (
      <div className="App">
        <input type="file" onChange={(event) => {setImagseUpload(event.target.files[0])}}/>
        <button onClick={uploadImage}> upload image </button>
  
      {imageList.map((url) => {
        return <img src={url} />
      })}
  
      </div>
  
    );
  };