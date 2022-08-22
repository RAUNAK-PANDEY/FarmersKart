import React, { useState, useEffect ,useRef} from "react";
import { useHistory } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CNav,
  CNavItem,
  CNavLink,
  CTabs,
  CTabPane,
  CTabContent,
  CInputGroup,
  CLabel,
  CPopover,
  CToast,
  CToastBody,
  CToastHeader,
  CToaster,
  CTextarea,
  CAlert,
  CDropdown,
  CDropdownToggle,
  CDropdownItem,
  CDropdownMenu,
  CImg,
  CInput,
  CCardFooter,
  CContainer,
  CCardImgOverlay,
} from "@coreui/react";
import firebase from "../../config/fbconfig";
import { exportDataToXLSX } from "../../utils/exportData";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useFormik } from "formik";
import { CardMedia } from "@material-ui/core";
import GridContainer from "../Grid/GridContainer";
import GridItem from "../Grid/GridItem";
import CustomTable from "../CustomTable/CustomTable";
const AdminOrder = ({ match }) => {
  const history = useHistory();

  const [tableFilters, setTableFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = React.useState(false);
  const [order, setOrder] = useState("");
  const [porder, setPorder] = useState("");
  const [lorder, setLorder] = useState("");
  const [dorder, setDorder] = useState("");
  const [cat, setCat] = useState([]);
  const [cartTable, setCartTable] = useState([]);
  var [state, setState] = useState({
    users: null,
    porder: null,
    lorder: null,
    dorder: null,
  });
  const initialFormData = {
    name:""
  };
  const formData = useFormik({
    initialValues: initialFormData,
  });

  useEffect(() => {
    // getUsers();
    getLorder();
  }, []);
  useEffect(() => {
    getUsers();
  }, [refresh]);
  // console.log(cat)
  const getLorder = async () => {
    await firebase.firestore().collection("temp").doc("admin").update({ carts: []})
    // .then((res) => {
    // alert("added successfully");
    setUserCartItems([])
    setLoading(true);
    const users = await firebase.firestore().collection("products").get();
    setLorder(users.docs.length);

    const resolvedUsers = users.docs.map((user) => {
      const id = user.id;
      const userData = user.data();

      return {
        ...userData,
        id: id,
        name: userData.name,
        society: userData.society,
      };
    });
    setState({
      ...state,
      lorder: resolvedUsers,
    });
    setLoading(false);
    
  };
 
  const [type, setType] = useState("");
  const [otype, setOType] = useState("");
  const [para, setPara] = useState("");
  const [status, setStatus] = useState({id:"",number:""});
  var [gdata, setData] = useState([]);
  const [visible, setVisible] = useState(false)

  const updatedPara = async (s) => {
    setPara(s)
    // getUsers();
  };
  const updatedType = async (s) => {
    setType(s)
    // setData([]);
    // getUsers();
  };
  const updatedOrderType = async (s) => {
    setOType(s)
    // setData([]);
    // getUsers();
  };
  const updatedStatus = async (s,n) => {
    setStatus({id:s,number:n})
    // console.log(status.name);
  };

  const getUsers = async () => {
    if (para ==="name") {
      const users = await firebase.firestore().collection("users").where("userType","==",type).where("name","==",formData.values.name).get();
      // setLorder(users.docs.length);
  
      const resolvedUsers = users.docs.map((user) => {
        const id = user.id;
        const userData = user.data();
  
        return {
          ...userData,
          id: id,
          customerName: userData.name,
          customerNumber:userData.mobile,
          customerToken:userData.firebaseToken,
          societyName: userData.societyName,
          userType:userData.userType,
          address:userData.address,
          centerId:userData.centerId,
          customerEmail:userData.email,
          wing:userData.wing,
          flatNo:userData.flatNo
        };
      });
      // Object.assign(gdata=resolvedUsers)
      setData(resolvedUsers);
      setRefresh(!refresh);
        
    }else if (para ==="email") {
      const users = await firebase.firestore().collection("users").where("userType","==",type).where("email","==",formData.values.name).get();
      // setLorder(users.docs.length);
  
      const resolvedUsers = users.docs.map((user) => {
        const id = user.id;
        const userData = user.data();
  
        return {
          ...userData,
          id: id,
          customerName: userData.name,
          customerNumber:userData.mobile,
          customerToken:userData.firebaseToken,
          societyName: userData.societyName,
          userType:userData.userType,
          address:userData.address,
          centerId:userData.centerId,
          customerEmail:userData.email,
          wing:userData.wing,
          flatNo:userData.flatNo
        };
      });
      // Object.assign(gdata=resolvedUsers)
      setData(resolvedUsers);
      setRefresh(!refresh);
        
    }else if (para ==="mobile") {
      const users = await firebase.firestore().collection("users").where("userType","==",type).where("mobile","==",formData.values.name).get();
      // setLorder(users.docs.length);
  
      const resolvedUsers = users.docs.map((user) => {
        const id = user.id;
        const userData = user.data();
  
        return {
          ...userData,
          id: id,
          customerName: userData.name,
          customerNumber:userData.mobile,
          customerToken:userData.firebaseToken,
          societyName: userData.societyName,
          userType:userData.userType,
          address:userData.address,
          centerId:userData.centerId,
          customerEmail:userData.email,
          wing:userData.wing,
          flatNo:userData.flatNo
        };
      });
      // Object.assign(gdata=resolvedUsers)
      setData(resolvedUsers);
      setRefresh(!refresh);
        
    }

  // console.log(gdata);
  // setLoading(true);
  // const response=await firebase.firestore().collection("users").where("userType","==",type);
  // const data=await response.get();
  // data.docs.forEach(item=>{
  //   gdata.push({id:item.id,...item.data()});
  // })
  // setData([...gdata,gdata])
  // console.log(gdata);
  // setOrder(users.docs.length);
  // filter((x) => x.orderStatus === 'placed')

  // const resolvedUsers = users.docs.map((user) => {
  //   const id = user.id;
  //   const userData = user.data();

  //   return {
  //     ...userData,
  //     id: id,
  //     cid:userData.userId,
  //     list:userData.orderList,
  //     image:userData.imageUrl,
  //     cname:userData.name,
  //     ddate:new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit'}).format(userData.date),
  //     date:userData.date,
  //     // mode:userData.paymentMethod,
  //     amount:userData.totalAmount,
  //     type:userData.userType,
  //     cemail:userData.customerEmail,
  //     cphno:userData.customerNumber,
  //     fno:userData.flatNo,
  //     wing:userData.wing,
  //     socName:userData.societyName,
  //     status:userData.orderStatus,
  //     // oitems:userData.items.map(sub=>{
  //     //     return(sub.name)
  //     // })

  //     // name: userData.name || "Not Defined",
  //     // whatsAppNumber: userData.whatsAppNumber || "-",
  //     // referralCode: userData.referralCode
  //     //   ? userData.referralCode.toString()
  //     //   : "",
  //     // primaryAddress:
  //     //   userData.addresses && userData.addresses.length > 0
  //     //     ? `${userData.addresses[0].line1}, ${userData.addresses[0].line2}, ${userData.addresses[0].city}, ${userData.addresses[0].state}`
  //     //     : "Not Defined",
  //     // id: user.id,
  //   };
  // });
  // setState({
  //   ...state,
  //   users: resolvedUsers,
  // });

  // console.log(users.date);
};

  let itemLists = [];
  state.lorder &&
    state.lorder.map((soc) => {
      let img = "";
      soc.imageUrl.forEach((element) => {
        img = element;
      });

      {
        soc.society &&
          soc.society.map((user) => {
            itemLists.push({
              image: img,
              name: soc.name,
              price: user.discountedPrice,
              unit: user.unit,
              weight: user.weight,
              id:soc.id 
            });
          });
      }
    });
    
  // console.log(itemLists)
  // console.log(cartTable);
  let totalp = 0;
  let totaldelivery = 0;
  const addItemToCart = async (mSubType) => {
    // create clicked cart item
    // console.log(mSubType)
    const cartItem = {
      comment :'',
      name: mSubType.name,
      price: mSubType.price,
      weight: mSubType.weight +" "+ mSubType.unit,
      quantity: 1,
      discountedPrice : parseFloat(mSubType.price),
      originalPrice: parseFloat(mSubType.price),
      itemStatus:"placed",
      imageUrl:mSubType.image,
      productId:mSubType.id,
      message :"",
      SubCategory :"",
      brandName :"",
      category :"",
      categoryName :"",
      gst:"",
      hsn:""
    };
   

    await firebase
      .firestore()
      .collection("temp")
      .doc("admin")
      .update({ carts: firebase.firestore.FieldValue.arrayUnion(cartItem) })
      .then((res) => {
        setVisible(true)
      });
    fetchCartItems();
  };
  const [userCartItems, setUserCartItems] = useState([]);

  const fetchCartItems = async () => {
    const userSnap = await firebase
      .firestore()
      .collection("temp")
      .doc("admin")
      .get();

    if (userSnap.data().carts && userSnap.data().carts.length) {
      setUserCartItems(userSnap.data().carts);
    } else {
      setUserCartItems([]);
    }
  };

  const handleIncrement = async (e) => {
    let pr = parseFloat(e.price);
    e.quantity += 1;
    // e.discountedPrice=(parseFloat(e.discountedPrice) + pr).toString(); 
    // e.price = (pr * e.quantity).toString();
    // console.log((parseFloat(e.discountedPrice) + pr))
    // push updated cart items to db
    for (var i = cartTable.length; i--;) {
      if (cartTable[i].name === e.name) {cartTable[i].totalAmount = (pr * e.quantity).toString();
        cartTable[i].quantity = e.quantity;
      }
    }
    // e.originalPrice = e.discountedPrice
    await firebase
      .firestore()
      .collection("temp")
      .doc("admin")
      .update({ carts: userCartItems })
      .then((res) => {
        console.log("updated");
      });
    fetchCartItems();
  };

  const handleDecrement = async (e) => {
    // console.log(e)
    // e.preventDefault();
    if (e.quantity > 1) {
      let pr = parseFloat(e.price);

      e.quantity -= 1;
    //   e.discountedPrice=(parseFloat(e.discountedPrice) - pr).toString();
      for (var i = cartTable.length; i--;) {
        if (cartTable[i].name === e.name) {cartTable[i].totalAmount -= pr;
          cartTable[i].quantity = e.quantity;
        }
      }
    //   e.originalPrice = e.discountedPrice
      await firebase
        .firestore()
        .collection("temp")
        .doc("admin")
        .update({ carts: userCartItems })
        .then((res) => {
          console.log("updated");
        });
      fetchCartItems();

      fetchCartItems();
    }
  };
   
  const [loadingCart, setLoadingCart] = useState(false);
  const deleteCartItem = async (mCartItem) => {
    // let tempCartItems = [...userCartItems];
    // tempCartItems = tempCartItems.filter(
    //   (mCart) => mCartItem.sub_type_id !== mCart.sub_type_id
    // );
    for (var i = cartTable.length; i--;) {
      if (cartTable[i].name === mCartItem.name) cartTable.splice(i, 1);
    }
      // cartTable.pop({
      //   name: mCartItem.name,
      //   weight: mCartItem.weight + mCartItem.unit,
      //   price: mCartItem.price,
      //   totalAmount: mCartItem.price,
       
      // });
      
    totalp-=parseFloat(mCartItem.price)
    console.log(totalp)
    setLoadingCart(true);
    // push this to db
    
    await firebase
    .firestore()
    .collection("temp")
    .doc("admin")
    .update({ carts: firebase.firestore.FieldValue.arrayRemove(mCartItem) })
    .then((res) => {
      console.log("updated");
    });
    await fetchCartItems();
    setLoadingCart(false);
  };
  const deleteCart = async () => {
    console.log(cartTable)
    for(let i=0;i<cartTable.length;i++){
      console.log(cartTable[i])
      deleteCartItem(cartTable[i])
    }
  };
  
  const [isfetching, setIsfetching] = useState(true);
  useEffect(() => {
    fetchCartItems();
    setIsfetching(false);
  }, []);
  // console.log(cartTable);
  const [searchItemlength, setSearchItemlength] = useState(0);
  const [itemListslength, setItemListlength] = useState(itemLists.length);
  const [searchItemList, setSearchItemList] = useState([])
  // let searchItemList =[]
  const searchItem = async (it) => {
    let obj = itemLists.find(o => o.name.toLowerCase() === it.toLowerCase());
    console.log(obj);
    if(obj){ 
       
      searchItemList.find(o => o.name.toLowerCase().substr(0,4) !== it.toLowerCase().substr(0,4));{
      // searchItemList.push(obj)
      setSearchItemList([...searchItemList , obj])}
      itemLists =[]
      setItemListlength(0)
    }
    console.log(searchItemList);
    if(it !="") {setSearchItemlength(searchItemList.length)}
    else {
      setSearchItemlength(0)
    }
  };

   
  // useEffect(() => {
  //   getUsersDetails();
  // }, [refresh]);
  

//   var [gdata, setData] = useState([]);
//   const getUsersDetails = async () => {
//     console.log(cat.name)
//       // let name1 = (cat.userType.charAt(0).toUpperCase() +cat.userType.slice(1));
//       const users = await firebase.firestore().collection("users").where("name","==",cat.name).get();
//       // setLorder(users.docs.length);
      
//       const resolvedUsers = users.docs.map((user) => {
//         const id = user.id;
//         const userData = user.data();
  
//         return {
//           ...userData,
//           id: id,
//           customerName: userData.name,
//           customerNumber:userData.mobile,
//           customerToken:userData.firebaseToken,
//           societyName: userData.societyName,
//           userType:userData.userType,
//           address:userData.address,
//           centerId:userData.centerId,
//           customerEmail:userData.email,
//           wing:userData.wing,
//           flatNo:userData.flatNo
//         };
//       });
//       console.log(resolvedUsers)
//       // Object.assign(gdata=resolvedUsers)
//       setData(resolvedUsers);
//       setRefresh(!refresh);
        
   
//   }


const sendOrder = async () =>{
  otype == "Admin"?
    gdata.map(async (sub) =>{
       if (sub.id == status.id) {
        await firebase
            .firestore()
            .collection("orders")
            .add({items: userCartItems,address:sub.address,customerId:sub.id,customerEmail:sub.customerEmail,centerId:sub.centerId,customerToken:sub.customerToken,customerName: sub.customerName ,customerNumber:sub.customerNumber, wing : sub.wing , userType :sub.userType,totalAmount :totalp, unpaidAmount :totalp, flatNo : sub.flatNo,discountAmount:0 , deliveryAmount :0,deliveryInstructions:"",comment:"",datePlaced:Date.now(),datePicked:"",dateDelivered:"",isCancelled:false,isCompleted:false,packedBy:"",orderStatus:"placed",
                    riderId:"", riderName:"",riderNumber:"",riderReview:"",riderStatus:"",riderToken:"",unpaidAmount:totalp,payment:[{amount:totalp,data:Date.now(),method:"COD"}],isRated:false,societyName:sub.societyName,unpaidStatus:"",paidUnpaidAmount:"" , 
                    couponCode :"" ,couponId:"",customerReview:"",isUpdated:false,itemTotalAmount:totalp,message:""
            // customerNumber : cat?.customerNumber , orderStatus: cat.orderStatus , societyName: cat?.societyName ,riderId : cat.riderId,riderName:
            // cat.riderName , riderNumber:cat.riderNumber,
            // riderReview : cat.riderReview, riderStatus:cat.riderStatus,riderToken:cat.riderToken, isCancelled:cat.isCancelled, isCompleted :cat.isCompleted, isUpdated :false
            })
            .then(async(res) => {
              await firebase
              .firestore()
              .collection("admins")
              .doc("admin")
              .update({ carts: []})
              .then((res) => {
                  if(type == "Society"){
                    history.push("/users");
                }else if (type == "Shop") {
                    history.push("/users/shop-order");
                }else if (type == "Hotel") {
                    history.push("/users/hotel-order");
                }
                // alert("added successfully");
              });
                
            })  
       }         
                                
    })
    :
    gdata.map(async (sub) =>{
      if (sub.id == status.id) {
        await firebase
           .firestore()
           .collection("orders")
           .add({items: userCartItems,address:sub.address,customerId:sub.id,customerEmail:sub.customerEmail,centerId:sub.centerId,customerToken:sub.customerToken,customerName: sub.customerName ,customerNumber:sub.customerNumber, wing : sub.wing , userType :sub.userType,totalAmount :0, unpaidAmount :0, flatNo : sub.flatNo,discountAmount:0 , deliveryAmount :0,deliveryInstructions:"",comment:"",datePlaced:Date.now(),datePicked:"",dateDelivered:"",isCancelled:false,isCompleted:false,packedBy:"",orderStatus:"placed",
                   riderId:"", riderName:"",riderNumber:"",riderReview:"",riderStatus:"",riderToken:"",unpaidAmount:0,payment:[{amount:0,data:Date.now(),method:"COD"}],isRated:false,societyName:sub.societyName,unpaidStatus:"",paidUnpaidAmount:"" , 
                   couponCode :"" ,couponId:"",customerReview:"",isUpdated:false,itemTotalAmount:totalp,message:""
           // customerNumber : cat?.customerNumber , orderStatus: cat.orderStatus , societyName: cat?.societyName ,riderId : cat.riderId,riderName:
           // cat.riderName , riderNumber:cat.riderNumber,
           // riderReview : cat.riderReview, riderStatus:cat.riderStatus,riderToken:cat.riderToken, isCancelled:cat.isCancelled, isCompleted :cat.isCompleted, isUpdated :false
           })
           .then(async(res) => {
             await firebase
             .firestore()
             .collection("admins")
             .doc("admin")
             .update({ carts: []})
             .then((res) => {
                 if(type == "Society"){
                   history.push("/users");
               }else if (type == "Shop") {
                   history.push("/users/shop-order");
               }else if (type == "Hotel") {
                   history.push("/users/hotel-order");
               }
               // alert("added successfully");
             });
               
           })  
      }          
                               
   })
  }
  const [searchTerm, setSearchTerm] = useState("");
  const inputEl = useRef("");
  const [searchResults, setSearchResults] = useState([]);
  
  const updateInput = () => {
    
    
    if (searchTerm !== "") {
      const newContactList = itemLists.filter((contact) => {
        const searchList = [];
        print(contact, searchList);
        
        return (
          searchList
            .join(" ")
            // .toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        );
      });
      setSearchResults(newContactList);
    } else {
      setSearchResults(itemLists);
    }
  };

  // Quick test
  const print = (obj, searchList) => {
    const values = Object.values(obj);
    // console.log(values);
    // console.log(searchList);

    values.forEach((val) => {
      if (val !== null && typeof val === "object") {
        print(val, searchList);
      } else {
        if (
          val !== null 
          // &&
          // val.length <= 20 &&
          // val !== "" &&
          // typeof val !== "bool"
        ) {
          searchList.push(val);
        }
      }
    });
  };

  const [toast, addToast] = useState(0)
  const toaster = useRef()

  return (
    <div>
      <CRow>
        {/* <CCol xl={1} /> */}
        <CCol>
          <CCard>
            <CCardBody>
            <CRow>
              <CCol md="3"><CLabel>Select Order Type </CLabel></CCol>
                  <CCol md="9">
                    <CDropdown className="mt-2" style={{ border: "1px solid #d8dbe0", borderRadius:"0.25rem" }}>
                                  <CDropdownToggle
                                    caret
                                    varient={"outline"}
                                  >
                                    {otype===""?"Select Order Type":otype}
                                  </CDropdownToggle>
                                  <CDropdownMenu style={{ width: "100%"}}>
                                    <CDropdownItem header>Select Order Type</CDropdownItem>
                                    <CDropdownItem divider />
                                    <CDropdownItem onClick={() =>updatedOrderType("Admin")}>Admin</CDropdownItem>
                                    <CDropdownItem onClick={() =>updatedOrderType("Replacement")}>Replacement</CDropdownItem>
                                    <CDropdownItem onClick={() =>updatedOrderType("Missing Items")}>Missing Items</CDropdownItem>
                                    {/* <CDropdownItem onClick={() =>updatedType("Hotel")}>Hotel</CDropdownItem> */}
                                  </CDropdownMenu>
                        </CDropdown>
                        </CCol>
                    </CRow>
              <CRow>
              <CCol md="3"><CLabel>Select User Type </CLabel></CCol>
                  <CCol md="9">
                    <CDropdown className="mt-2" style={{ border: "1px solid #d8dbe0", borderRadius:"0.25rem" }}>
                                  <CDropdownToggle
                                    caret
                                    varient={"outline"}
                                  >
                                    {type===""?"Select User Type":type}
                                  </CDropdownToggle>
                                  <CDropdownMenu style={{ width: "100%"}}>
                                    <CDropdownItem header>Select User type</CDropdownItem>
                                    <CDropdownItem divider />
                                    <CDropdownItem onClick={() =>updatedType("Society")}>Society</CDropdownItem>
                                    <CDropdownItem onClick={() =>updatedType("Shop")}>Shop</CDropdownItem>
                                    <CDropdownItem onClick={() =>updatedType("Hotel")}>Hotel</CDropdownItem>
                                  </CDropdownMenu>
                        </CDropdown>
                        </CCol>
                    </CRow>
                    <CRow>
              {/* <b>{cat.imageUrl =="" && cat.orderList}</b> */}
              <CCol md="3"><CLabel>Select Parameter </CLabel></CCol>
                  <CCol md="9">
              <CDropdown className="mt-2" style={{ border: "1px solid #d8dbe0", borderRadius:"0.25rem" }}>
                                  <CDropdownToggle
                                    caret
                                    varient={"outline"}
                                  >
                                    {para===""?"Select Parameter":para}
                                  </CDropdownToggle>
                                  <CDropdownMenu style={{ width: "100%"}}>
                                    <CDropdownItem header>Select User type</CDropdownItem>
                                    <CDropdownItem divider />
                                    <CDropdownItem onClick={() =>updatedPara("name")}>Name</CDropdownItem>
                                    <CDropdownItem onClick={() =>updatedPara("email")}>Email</CDropdownItem>
                                    <CDropdownItem onClick={() =>updatedPara("mobile")}>Mobile No</CDropdownItem>
                                  </CDropdownMenu>
                        </CDropdown>
                        </CCol>
                    </CRow>
                    <CRow>
                    <CCol md="3">
                            <CLabel>Enter User Details</CLabel>
                        </CCol>
                        <CCol md={6}>
                            <CInput
                            required 
                            type="text"
                            placeholder="Name"
                            name="name"
                            value={formData.values.name}
                            onChange={(e) => {
                                formData.handleChange(e);
                                // setFormData({
                                //   ...formData.values,
                                //   name: e.target.value
                                // })
                            }}
                            />
                        </CCol>
                        <CCol md="3">
                        {/* <CPopover
                          content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus."
                          placement="right"
                        >
                          <CButton color="secondary">Popover on right</CButton>
                        </CPopover> */}
                        <CButton
                                  style={{
                                    color: "#fff",
                                    backgroundColor: "#f8b11c",
                                    borderColor: "#f8b11c",
                                    borderRadius: "0.25rem",
                                    marginRight: "5px",
                                  }}
                                  type="button"
                                  color="secondary"
                                  variant="outline"
                                  onClick={() => getUsers()}
                                >
                                  Search
                                </CButton>

                        </CCol>
                    </CRow>
                    <CRow>
                <CCol md="3"><CLabel>Select User</CLabel></CCol>
                  <CCol md="9">
                        <CDropdown className="mt-2" style={{ border: "1px solid #d8dbe0", borderRadius:"0.25rem" }}>
                                  <CDropdownToggle
                                    caret
                                    varient={"outline"}
                                  >
                                    {status.number===""?"Select User":status.number}
                                  </CDropdownToggle>
                                  <CDropdownMenu style={{ width: "100%"}}>
                                    <CDropdownItem header>Select User</CDropdownItem>
                                    <CDropdownItem divider />
                                    {
                                        gdata && gdata.map((cat,index)=>{
                                            return(
                                            <CDropdownItem onClick={() => updatedStatus(cat.id,cat.mobile)}><div><div>{cat.customerName}</div><div>{cat.mobile}</div></div></CDropdownItem>
                                            )
                                        })
                                    }
                                  </CDropdownMenu>
                        </CDropdown>
                        </CCol>
                    </CRow>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={6}>
          <CCard>
            <CCardHeader
              className="d-flex justify-content-between align-items-center"
              style={{
                fontWeight: "bold",
                backgroundColor: "#f7f7f7",
                fontSize: "1.1rem",
                color: "black",
              }}
            >
              <span className="font-xl">My Cart</span>
            </CCardHeader>
            <CCardBody>
              <div style={{ padding: "2em", textAlign: "center" }}>
                <CustomTable tableData={cartTable} />
              </div>

              <hr></hr>
              {cartTable.map((res) => {
                totalp += parseFloat(res.totalAmount);
              })}
              <CRow>
                {" "}
                <CCol>
                  <p>Total Amount : {totalp}</p>{" "}
                </CCol>
                <CCol>
                  <p>Payment Option : Cash On Delivery</p>
                </CCol>
              </CRow>
              <CRow>
                {" "}
                <CCol>
                  {/* <p>Delivery Charges : {totaldelivery =totalp > 200 ? 0 : 40}</p>{" "} */}
                </CCol>
                <CCol>
                  <button
                    className="itemBut btn btn-danger  m-2 "
                    onClick={async () =>
                      sendOrder()
                      // await firebase
                      //   .firestore()
                      //   .collection("orders")
                      //   .add({ items: userCartItems, customerName: cat.name , wing : cat.wing , userType : cat.userType.charAt(0).toUpperCase() +cat.userType.slice(1),totalAmount : totalp , unpaidAmount : totalp , flatNo : cat.flatNo,discountAmount:0 , deliveryAmount : 40,deliveryInstructions:"", 
                      //   orderStatus : "processed",isCancelled : false ,isCompleted: false,payment:[{amount:totalp>200?totalp+0:totalp+40,data:Date.now(),method:"COD"}]
                      //   // customerNumber : cat?.customerNumber , orderStatus: cat.orderStatus , societyName: cat?.societyName ,riderId : cat.riderId,riderName:
                      //   // cat.riderName , riderNumber:cat.riderNumber,
                      //   // riderReview : cat.riderReview, riderStatus:cat.riderStatus,riderToken:cat.riderToken, isCancelled:cat.isCancelled, isCompleted :cat.isCompleted, isUpdated :false
                      //   })
                         
                      //   .then(async(res) => {
                          
                      //     await firebase
                      //     .firestore()
                      //     .collection("temp")
                      //     .doc("admin")
                      //     .update({ carts: []})
                      //     .then((res) => {
                      //       alert("added successfully");
                      //     });
                      //     await firebase
                      //     .firestore()
                      //     .collection("handyOrders")
                      //     .doc(match.params.id)
                      //     .update({ orderStatus: "processed"})
                      //     .then((res) => {
                      //       console.log('updated sucessfully')
                      //     });
                      //   })
                    }
                  >
                    Proceed To Checkout
                  </button>
                </CCol>
              </CRow>

              <p>Final Total Amount : {totalp}</p>
            </CCardBody>
          </CCard>
        </CCol>
        {/* <CCol xl={1} /> */}
      </CRow>


      <CCard>
        <CCardBody>
        <CRow>
        <CCol sm={6}>  <CInput
            required
            type="text"
            placeholder="Search here"
            name="name"
            input={inputEl}
            onChange={(e) => {
                    // console.log(e.target.value)
                    // searchItem(e.target.value);
                    if(e.target.value == ''){updateInput()}
                    setSearchTerm(e.target.value);
                  }}
                  onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          updateInput()
                        }
                    }}
          /></CCol>
      
          {/* <CButton
                            style={{
                              color: "#fff",
                              backgroundColor: "#f8b11c",
                              borderColor: "#f8b11c",
                          
                              borderRadius: "0.25rem",
                              width: 100,
                            }}
                            type="button"
                            color="secondary"
                            variant="outline"
                            onClick={() => updateInput()}
                          >
                            Search
                          </CButton> */}
                          </CRow>
          
          {/* {
                        state.lorder && state.lorder.map((soc) => {
                         return <div>
                          {soc.name}
                         </div>
  
                        })
                }   */}
          <br></br>
          <br></br>

          {/* <CCol sm={2} > */}
          <GridContainer>

          {itemListslength ==0 && searchResults &&
            searchResults.map((soc) => {
                var containItem = userCartItems.find((element) => {
                  return ((element.name === soc.name) && (element.weight=== soc.weight +" "+ soc.unit));
                });
                return (
                  <GridItem xs={2} sm={4} md={3} lg={2}>
                    {" "}
                    <CCard>
                      <CCardBody>
                        <CImg
                          // key={index}
                          rounded="true"
                          src={soc.image}
                          width={115}
                          height={100}
                          style={{ marginLeft: -10 }}
                        />
                        <b>
                          ₹{" "}
                          {soc.name.length <= 9
                            ? soc.name
                            : soc.name.substr(0, 8) + "..."}
                        </b>
                        <CRow style={{ marginTop: 15 }}>
                          {" "}
                          <CCol style={{ marginLeft: -10 }}>
                            {" "}
                            ₹ {soc.price}{" "}
                          </CCol>
                          <CCol style={{ marginLeft: -10 }}>
                            {" "}
                            {soc.weight.length <= 4
                            ? soc.weight
                            : soc.name.substr(0, 4)}{soc.unit} {soc.unit}{" "}
                          </CCol>
                          {/* <CCol
                            style={{
                              marginLeft: -70,
                              marginTop: -10,
                              marginRight: 5,
                            }}
                          >
                            {" "}
                            <CDropdown className="mt-2">
                              <CDropdownToggle
                                style={{
                                  border: "1px solid #d8dbe0",
                                  borderRadius: "0.25rem",
                                  width: "110%",

                                  textAlign: "left",
                                }}
                                caret
                                varient={"outline"}
                              >
                                {soc.weight.length <=3 ?soc.weight : soc.weight.substr(0,2)} {soc.unit}
                              </CDropdownToggle>
                              <CDropdownMenu>
                                <CDropdownItem header>
                                  {" "}
                                  {soc.weight} {soc.unit}{" "}
                                </CDropdownItem>
                              </CDropdownMenu>
                            </CDropdown>{" "}
                          </CCol> */}
                        </CRow>
                        
                        {!containItem ? (
                          
                          <CButton
                            style={{
                              color: "#fff",
                              backgroundColor: "#f8b11c",
                              borderColor: "#f8b11c",
                              marginTop: "5px",
                              borderRadius: "0.25rem",
                              width: 100,
                            }}
                            type="button"
                            color="secondary"
                            variant="outline"
                            onClick={async () => {
                              console.log("hello");
                            //   getUsers();
                              setCartTable([
                                ...cartTable,
                                {
                                  name: soc.name,
                                  weight: soc.weight +" "+ soc.unit,
                                  quantity : soc.quantity,
                                  price: soc.price,
                                  quantity : 1,
                                  totalAmount: soc.price,
                                  // Action :  <button
                                  //       className="itemBut btn btn-danger  m-2 "
                                  //       onClick={async () =>
                                  //       deleteCart()
                                            
                                  //       }
                                  //   >
                                  //       delete
                                  //   </button>
                                },
                              ]);
                              await addItemToCart(soc);
                              // firebase.firestore().collection("temp").doc("admin").update({carts : cartTable}).then(res =>{
                              //     alert('updated')
                              // });
                            }}
                          >
                            Add
                          </CButton>
                        ) : (
                          <div className="quanHandler">
                            <CButton
                              style={{
                                color: "#fff",
                                backgroundColor: "#f8b11c",
                                borderColor: "#f8b11c",
                                marginTop: "5px",
                                borderRadius: "0.25rem",
                                width: 30,
                              }}
                              type="button"
                              color="secondary"
                              variant="outline"
                              onClick={() => handleDecrement(containItem)}
                            >
                              -
                            </CButton>
                            &nbsp;&nbsp;
                            <span className="idTest">
                              {containItem.quantity}
                            </span>{" "}
                            &nbsp;&nbsp;
                            <CButton
                              style={{
                                color: "#fff",
                                backgroundColor: "#f8b11c",
                                borderColor: "#f8b11c",
                                marginTop: "5px",
                                borderRadius: "0.25rem",
                                width: 30,
                              }}
                              type="button"
                              color="secondary"
                              variant="outline"
                              onClick={() => handleIncrement(containItem )}
                            >
                              +
                            </CButton>
                          </div>
                        )}
                        {containItem && (
                                  <span
                                    style={{
                              color: "red",
                              
                            }}
                                    onClick={() => deleteCartItem(containItem)}
                                  >
                                    Remove
                                  </span>
                                )}
                      </CCardBody>
                    </CCard>{" "}
                    <br></br>
                  </GridItem>
                );
              })}


            {
             
              searchItemlength ===0 && itemLists &&
              itemLists.map((soc) => {
                var containItem = userCartItems.find((element) => {
                  return ((element.name === soc.name) && (element.weight=== soc.weight+" " + soc.unit));
                });
                return (
                  <GridItem xs={2} sm={4} md={3} lg={2}>
                    {" "}
                    <CCard>
                      <CCardBody>
                        <CImg
                          // key={index}
                          rounded="true"
                          src={soc.image}
                          width={115}
                          height={100}
                          style={{ marginLeft: -10 }}
                        />
                        <b>
                          ₹{" "}
                          {soc.name.length <= 9
                            ? soc.name
                            : soc.name.substr(0, 8) + "..."}
                        </b>
                        <CRow style={{ marginTop: 15 }}>
                          {" "}
                          <CCol style={{ marginLeft: -10 }}>
                            {" "}
                            ₹ {soc.price}{" "}
                          </CCol>
                          <CCol style={{ marginLeft: -30 }}>
                            {" "}
                            {soc.weight.length <= 4
                            ? soc.weight
                            : soc.name.substr(0, 4)}{soc.unit}
                          </CCol>
                          {/* <CCol
                            style={{
                              // marginLeft: -70,
                              marginTop: -10,
                              // marginRight: 5,
                            }}
                          >
                          
                            {" "}
                            <CDropdown className="mt-2">
                              <CDropdownToggle
                                style={{
                                  border: "1px solid #d8dbe0",
                                  borderRadius: "0.25rem",
                                  width: "190%",
                                  marginLeft :"-50%",
                                  textAlign: "left",
                                }}
                                caret
                                varient={"outline"}
                              >
                                {soc.weight.length <=3 ?soc.weight : soc.weight.substr(0,2)} {soc.unit}
                              </CDropdownToggle>
                              <CDropdownMenu>
                                <CDropdownItem header>
                                  {" "}
                                  {soc.weight} {soc.unit}{" "}
                                </CDropdownItem>
                              </CDropdownMenu>
                            </CDropdown>{" "}
                          </CCol> */}
                        </CRow>
                        {!containItem ? (
                          <CButton
                            style={{
                              color: "#fff",
                              backgroundColor: "#f8b11c",
                              borderColor: "#f8b11c",
                              marginTop: "5px",
                              borderRadius: "0.25rem",
                              width: 100,
                            }}
                            type="button"
                            color="secondary"
                            variant="outline"
                            onClick={async () => {
                              console.log("hello");
                            //   getUsers();
                              setCartTable([
                                ...cartTable,
                                {
                                  name: soc.name,
                                  weight: soc.weight +" "+ soc.unit,
                                  quantity : soc.quantity,
                                  price: soc.price,
                                  quantity : 1,
                                  totalAmount: soc.price,
                                  // Action :  <button
                                  //       className="itemBut btn btn-danger  m-2 "
                                  //       onClick={async () =>
                                  //       deleteCart()
                                            
                                  //       }
                                  //   >
                                  //       delete
                                  //   </button>
                                },
                              ]);
                              await addItemToCart(soc);
                              // firebase.firestore().collection("temp").doc("admin").update({carts : cartTable}).then(res =>{
                              //     alert('updated')
                              // });
                            }}
                          >
                            Add
                          </CButton>
                        ) : (
                          <div className="quanHandler">
                            <CButton
                              style={{
                                color: "#fff",
                                backgroundColor: "#f8b11c",
                                borderColor: "#f8b11c",
                                marginTop: "5px",
                                marginLeft: "-6px",
                                borderRadius: "0.25rem",
                                width: 30,
                              }}
                              type="button"
                              color="secondary"
                              variant="outline"
                              onClick={() => handleDecrement(containItem)}
                            >
                              -
                            </CButton>
                            &nbsp;&nbsp;
                            <span className="idTest">
                              {containItem.quantity}
                            </span>{" "}
                            &nbsp;&nbsp;
                            <CButton
                              style={{
                                color: "#fff",
                                backgroundColor: "#f8b11c",
                                borderColor: "#f8b11c",
                                marginTop: "5px",
                                marginLeft: "-4px",
                                borderRadius: "0.25rem",
                                width: 30,
                                 
                                textAlign :"center"
                              }}
                              type="button"
                              color="secondary"
                              variant="outline"
                              onClick={() => handleIncrement(containItem)}
                            >
                              +
                            </CButton>
                          </div>
                        )}
                    
                         
                        {containItem && (
                                  <span
                                    style={{
                                    color: "#FF0000",
                                    cursor : "pointer",
                                    display : "flex",
                                    justifyContent :"flex-end"
                                  }}
                                    onClick={() => 
                                    
                                    deleteCartItem(containItem)}
                                  >
                                    Remove
                                  </span>
                                )}
                      </CCardBody>
                    </CCard>{" "}
                    <br></br>
                  </GridItem>
                );
              })}
          </GridContainer>

          {/* {
                    state.lorder && state.lorder.map((soc) => {
                        let img=""
                        soc.imageUrl.forEach((element) => {
                                img = element
                            }
                        ); 
                         return <CRow>
                         {soc.society && soc.society.map((user) => {
                         return  <CCol sm={2}>
                            <CCard>
                             
                            <CCardBody>
                            <CImg
                                    // key={index}
                                    rounded="true"
                                    src={img}
                                    width={115}
                                    height={100}
                                    style={{marginLeft :-10  }}
                                    />  
                                      
                             <CRow style={{marginTop:15}}> <CCol  style={{marginLeft :-10 }}> ₹ {user.discountedPrice} </CCol>
                             <CCol style={{marginLeft :-70 , marginTop : -10 , marginRight :5 }}> <CDropdown className="mt-2"  >
                      <CDropdownToggle
                        style={{
                          border: "1px solid #d8dbe0",
                          borderRadius: "0.25rem",
                          width: "110%",
                           
                          textAlign: "left"
                        }}
                        caret
                        varient={"outline"}
                       
                      >
                         {user.weight} {user.unit} 
                      </CDropdownToggle>
                      <CDropdownMenu >
                        <CDropdownItem header> {user.weight} {user.unit} </CDropdownItem>
                         
                        
                      </CDropdownMenu>
                    </CDropdown>  </CCol></CRow>
                    <CButton
                            style={{
                              color: "#fff",
                              backgroundColor: "#f8b11c",
                              borderColor: "#f8b11c",
                              marginTop: "5px",
                              borderRadius: "0.25rem",
                              width :100
                            }}
                            type="button"
                            color="secondary"
                            variant="outline"
                            // onClick={addPrice}
                          >
                            Add
                          </CButton>
                            
                            
                            </CCardBody>
                           
                            </CCard>
                        </CCol>
                         
                        })}
                         </CRow>
  
                        })
                } */}
        </CCardBody>
      </CCard>
    </div>
  );
};

export default AdminOrder;
