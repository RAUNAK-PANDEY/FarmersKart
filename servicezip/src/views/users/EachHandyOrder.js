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
  CTextarea,
  CDropdown,
  CDropdownToggle,
  CDropdownItem,
  CDropdownMenu,
  CImg,
  CInput,
  CCardFooter,
  CContainer,
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
const EachHandyOrder = ({ match }) => {
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

  useEffect(() => {
    getUsers();
    getLorder();
  }, []);
  console.log(cat)
  const getLorder = async () => {
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
 
  const getUsers = async () => {
    setLoading(true);
    const users = await firebase
      .firestore()
      .collection("handyOrders")
      .doc(match.params.id)
      .get()
      .then((res) => {
        setCat(res.data());
        setLoading(false);
      });
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
            });
          });
      }
    });
    
  // console.log(itemLists)
  // console.log(cartTable);
  let totalp = 0;
  const addItemToCart = async (mSubType) => {
    // create clicked cart item
    const cartItem = {
      name: mSubType.name,
      price: mSubType.price,
      weight: mSubType.weight + mSubType.unit,
      quantity: 1,
    };

    firebase
      .firestore()
      .collection("admins")
      .doc("admin")
      .update({ carts: firebase.firestore.FieldValue.arrayUnion(cartItem) })
      .then((res) => {
        alert("updated");
      });
    fetchCartItems();
  };
  const [userCartItems, setUserCartItems] = useState([]);

  const fetchCartItems = async () => {
    const userSnap = await firebase
      .firestore()
      .collection("admins")
      .doc("admin")
      .get();

    if (userSnap.data().carts && userSnap.data().carts.length) {
      setUserCartItems(userSnap.data().carts);
    } else {
      setUserCartItems([]);
    }
  };

  const handleIncrement = async (e) => {
    e.quantity += 1;

    // push updated cart items to db
    await firebase
      .firestore()
      .collection("admins")
      .doc("admin")
      .update({ carts: userCartItems })
      .then((res) => {
        alert("updated");
      });
    fetchCartItems();
  };

  const handleDecrement = async (e) => {
    // console.log(e)
    // e.preventDefault();
    if (e.quantity > 1) {
      e.quantity -= 1;
      await firebase
        .firestore()
        .collection("admins")
        .doc("admin")
        .update({ carts: userCartItems })
        .then((res) => {
          alert("updated");
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

    setLoadingCart(true);
    // push this to db
    
    firebase
    .firestore()
    .collection("admins")
    .doc("admin")
    .update({ carts: firebase.firestore.FieldValue.arrayRemove(mCartItem) })
    .then((res) => {
      alert("updated");
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
       
      // searchItemList.push(obj)
      setSearchItemList([...searchItemList , obj])
      itemLists =[]
      setItemListlength(0)
    }
    console.log(searchItemList);
    if(it !="") {setSearchItemlength(searchItemList.length)}
    else {
      setSearchItemlength(0)
    }
  };
  console.log(searchItemlength)
  return (
    <div>
      <CRow>
        {/* <CCol xl={1} /> */}
        <CCol>
          <CCard>
            <CCardBody>
              <b>{cat.imageUrl =="" && cat.orderList}</b>
               
              {cat.imageUrl && <CImg
                          // key={index}
                          rounded="true"
                          src={cat.imageUrl}
                          width={300}
                          height={400}
                          style={{ marginLeft: -10 }}
                        />}
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
                totalp += parseFloat(res.price);
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
                  <p>Delivery Charges : 40</p>{" "}
                </CCol>
                <CCol>
                  <button
                    className="itemBut btn btn-danger  m-2 "
                    onClick={async () =>
                      await firebase
                        .firestore()
                        .collection("orders")
                        .add({ items: userCartItems, customerName: cat.name , wing : cat.wing , userType : cat.userType,totalAmount : totalp , unpaidAmount : totalp , flatNo : cat.flatNo,discountAmount:0 , deliveryAmount : 40,deliveryInstructions:"", 
                        // customerNumber : cat?.customerNumber , orderStatus: cat.orderStatus , societyName: cat?.societyName ,riderId : cat.riderId,riderName:
                        // cat.riderName , riderNumber:cat.riderNumber,
                        // riderReview : cat.riderReview, riderStatus:cat.riderStatus,riderToken:cat.riderToken, isCancelled:cat.isCancelled, isCompleted :cat.isCompleted, isUpdated :false
                        })
                        .then((res) => {
                          firebase
                          .firestore()
                          .collection("admins")
                          .doc("admin")
                          .update({ carts: []})
                          .then((res) => {
                            alert("added successfully");
                          });
                          
                        })
                    }
                  >
                    Proceed To Checkout
                  </button>
                </CCol>
              </CRow>

              <p>Final Total Amount : {totalp + 40}</p>
            </CCardBody>
          </CCard>
        </CCol>
        {/* <CCol xl={1} /> */}
      </CRow>

      <CCard>
        <CCardBody>
          <CInput
            required
            type="text"
            placeholder="Search here"
            name="name"
             
            onChange={(e) => {
                    // console.log(e.target.value)
                    searchItem(e.target.value);
                    
                  }}
          />
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

          {itemListslength ==0 && searchItemList &&
            searchItemList.map((soc) => {
                var containItem = userCartItems.find((element) => {
                  return element.name === soc.name;
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
                          <CCol
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
                          </CCol>
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
                              setCartTable([
                                ...cartTable,
                                {
                                  name: soc.name,
                                  weight: soc.weight + soc.unit,
                                  price: soc.price,
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
                              // firebase.firestore().collection("admins").doc("admin").update({carts : cartTable}).then(res =>{
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
                              onClick={() => handleIncrement(containItem)}
                            >
                              +
                            </CButton>
                          </div>
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
                  return element.name === soc.name;
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
                          <CCol
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
                          </CCol>
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
                              setCartTable([
                                ...cartTable,
                                {
                                  name: soc.name,
                                  weight: soc.weight + soc.unit,
                                  price: soc.price,
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
                              // firebase.firestore().collection("admins").doc("admin").update({carts : cartTable}).then(res =>{
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
                              onClick={() => handleIncrement(containItem)}
                            >
                              +
                            </CButton>
                          </div>
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

export default EachHandyOrder;
