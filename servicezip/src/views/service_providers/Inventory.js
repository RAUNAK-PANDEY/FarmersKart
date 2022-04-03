import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  CBadge,
  CImg,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CButton,
  CDataTable,
  CRow,
  CSpinner,
  CInput,
  CSwitch,
  CTextarea,
  CInputGroup,
  CLabel,
  CPagination
} from "@coreui/react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useFormik } from "formik";
import {
  CDropdown,
  CDropdownToggle,
  CDropdownItem,
  CDropdownMenu,
  CWidgetProgress,
  CWidgetSimple,
  CForm,
  CFormGroup,
} from "@coreui/react";
// import {
//    }from '@coreui/react/src/components/table'
import firebase from "../../config/fbconfig";
import { exportDataToXLSX } from "../../utils/exportData";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Inventory = () => {
  const history = useHistory();

  const [tableFilters, setTableFilters] = useState({});
  const [refresh, setRefresh] = React.useState(false);
  const [loading, setLoading] = useState(false);
  var [cat, setCat] = useState([]);
  var [state, setState] = useState({
    orders: null,
    collapse: false,
  });
  const [orderMaker, setOrderMaker] = useState("");

  const [lastOrder, setLastOrder] = useState("");
  var [gdata, setData] = useState([]);

  const [pageLoading, setPageLoading] = useState(false);
  const initialFormData = {
    base:"",
    in:"",
    out:""
  };
  const formData = useFormik({
    initialValues: initialFormData,
  });

  useEffect(() => {
    getOrders();
    getData();
  }, []);

  const getData = async () => {
    const response = await firebase.firestore().collection("generalData");
    const data = await response.get();
    data.docs.forEach((item) => {
      gdata.push({ id: item.id, ...item.data() });
    });
    setData([...gdata, gdata]);
  };
  
  const getOrders = async () => {
    setLoading(true);
    const docs = (
      await firebase
        .firestore()
        .collection("products")
        // .orderBy("categoryName")
        .limit(5)
        .get()
    ).docs;
    
    setLastOrder(docs[docs.length - 1]);

    const value = docs.filter((doc) => {
      if (
        !(
          doc.data().category,
          doc.data().categoryName,
          doc.data().subCategory,          
          doc.data().description,          
          doc.data().brandName,
          doc.data().imageUrl ,
          doc.data().productPriority,
          doc.data().society ,
          doc.data().shop ,
          doc.data().hotel ,
          doc.data().type,
          doc.data().baseQuanity,
          doc.data().totalQuantity,
          doc.data().totalUnit,
          doc.data().name
        )
      ) {
        // console.log(doc.data());
      }
      return (
          doc.data().category,
          doc.data().categoryName,
          doc.data().subCategory,
          // doc.data().name,         
          doc.data().description,          
          doc.data().brandName,
          doc.data().imageUrl ,
          doc.data().productPriority,
          doc.data().society ,
          doc.data().shop ,
          doc.data().hotel ,
          doc.data().type,
          doc.data().baseQuanity,
          doc.data().totalQuantity,
          doc.data().totalUnit,
          doc.data().name
      );
    });

    // resolving individual orders for meta field data
    let processedOrders = await Promise.all(
      value.map(async (doc) => {
        const order = doc.data();
        return {
          ...order,
          id: doc.id,
        };
      })
    );

    // processedOrders = processedOrders.sort(compare);
    // console.log(processedOrders);
    setState({
      ...state,
      orders: processedOrders,
    });

    setLoading(false);
  };

  const [unit, setUnit] = useState("");
  const updatedType = async (s) => {
    setUnit(s);
  };
  const edit = (item,id) => {
    history.push(
      {
      pathname: '/view-inventory',
      state: item,
      index: id
      }
    )
  };
  const remove = (rowId) => {
    confirmAlert({
      title: "Delete Product",
      message: "Are you sure to Delete the Product?",
      buttons: [
        {
          label: "Yes",
          onClick: async() => {
            await firebase.firestore().collection("products").doc(rowId).delete();
            getOrders();
            // firebase
            //   .storage()
            //   .ref()
            //   .child("providers/" + match.params.id + "/verification_document")
            //   .delete()
            //   .then((url) => {
            //     console.log(url);
                alert("Product Deleted");
                setRefresh(!refresh);
            //   });
          },
        },
        {
          label: "No",
          // onClick: () => alert("Close"),
        },
      ],
      // childrenElement: () => <div />,
      // customUI: ({ onClose }) => <div>Custom UI</div>,
      closeOnEscape: true,
      closeOnClickOutside: true,
      willUnmount: () => {},
      afterClose: () => {},
      onClickOutside: () => {},
      onKeypressEscape: () => {},
      // overlayClassName: "overlay-custom-class-name"
    });

  };
  const addBase = async(id) => {
    await firebase.firestore().collection("products").doc(id).collection("inventory")
    .add({
        quanity:formData.values.base+" "+unit,
        type:"Base",
        date:Date.now(),
    }); 
    await firebase.firestore().collection("products").doc(id).update({
        baseQuanity:formData.values.base+" "+unit,
        totalQuantity:parseFloat(formData.values.base),
        totalUnit:unit,
        baseQuantityDate:Date.now(),
    });
    formData.resetForm();
    setUnit("");
    getOrders();
  };

  const qin = async(id) => {
    await firebase.firestore().collection("products").doc(id).collection("inventory")
    .add({
        quanity:formData.values.in+" "+unit,
        type:"In",
        date:Date.now(),
    });    
    if (unit == "gms" || unit =="ml") {
        await firebase.firestore().collection("products").doc(id).update({
            totalQuantity:firebase.firestore.FieldValue.increment(
             parseFloat(formData.values.in.valueOf())
            )
         });
    } else {
        await firebase.firestore().collection("products").doc(id).update({
            totalQuantity:firebase.firestore.FieldValue.increment(
             parseFloat(formData.values.in.valueOf())
            )
         });
        }
    
    formData.resetForm();
    setUnit("");
    getOrders();
  };

  const qout = async(id) => {
    await firebase.firestore().collection("products").doc(id).collection("inventory")
    .add({
        quanity:formData.values.out+" "+unit,
        type:"Out",
        // totalQuantity:formData.values.base+" "+unit,
        date:Date.now(),
    });  
    if (unit == "gms" || unit =="ml") {
        await firebase.firestore().collection("products").doc(id).update({
        
            totalQuantity:firebase.firestore.FieldValue.increment(
             -parseFloat(formData.values.out.valueOf())/1000
            )
         });
    } else {
        await firebase.firestore().collection("products").doc(id).update({
        
            totalQuantity:firebase.firestore.FieldValue.increment(
             -parseFloat(formData.values.out.valueOf())
            )
         });
    }    
    formData.resetForm();
    setUnit("");
    getOrders();
  };


  const onExportData = async () => {
    const filteredData = state.orders
      .filter((order) => {
        // return Object.keys(tableFilters).reduce((p, c) => {
        //   return String(order[c]).includes(tableFilters[c]) && p
        // }, true)
        for (const filterKey in tableFilters) {
          console.log(
            String(order[filterKey]).search(
              new RegExp("tableFilters[filterKey]", "i")
            )
          );
          if (
            String(order[filterKey]).search(
              new RegExp(tableFilters[filterKey], "i")
            ) >= 0
          ) {
            continue;
          } else {
            return false;
          }
        }
        return true;
      })
      .map((order) => ({
        // order.category,
        categoryName:order.categoryName,
        subCategory:order.subCategory,          
        description:order.description,          
        brandName:order.brandName,
        imageUrl:order.imageUrl,
        // order.productPriority,
        society:order.society,
        shop:order.shop ,
        hotel:order.hotel ,
        type:order.type,
        name:order.name
      }));
      exportPDF(filteredData);
    // exportDataToXLSX(filteredData, "ProductList");
  };
  const exportPDF = (e) => {
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "portrait"; // portrait or landscape

    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(15);

    const title = "Product List";
    const headers = [["Category Name","Sub Category Name","Product Name","Brand Name","Product Type", "Society Price", "Shop Price", "Hotel Price"]];

    const data = e.map((sub,index) =>[
      // [elt.name + "\n" + elt.number],
      sub.categoryName,
      sub.subCategory,
      sub.name,
      sub.brandName,
      sub.type,
      sub.society.map((sub1) =>
        [
          "Rs."+sub1.discountedPrice + " : " + sub1.weight + sub1.unit + "\n",
        ]
      ),
      sub.shop.map((sub1) =>
        [
          "Rs."+sub1.discountedPrice + " : " + sub1.weight + sub1.unit + "\n",
        ]
      ),
      sub.hotel.map((sub1) =>
        [
          "Rs."+sub1.discountedPrice + " : " + sub1.weight + sub1.unit + "\n",
        ]
      ),
  ]);
    let content = {
      startY: 50,
      head: headers,
      body: data,
      // content:charge,
      // foot:footer
    };

    console.log(content);
    console.log(data);
    doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    doc.save("productlist.pdf")
  }


  return (
    <CRow>
      <CCol xl={12}></CCol>
      <CCol xl={12}>
        <CCard>
          <CCardHeader style={{ fontWeight: "bold",backgroundColor:"#f7f7f7",fontSize:"1.1rem",color: "black"}}>
            <span className="font-xl">Product List</span>
            <span>
              {/* <CButton color="info" className="mb-2 mr-2" 
            //   onClick={onExportData} 
              style={{ float:"right"}}>
                Export Data
              </CButton> */}
            </span>
            </CCardHeader>
          <CCardBody style={{textAlign: "center"}}>
            <CDataTable style={{border:"1px solid #ebedf0"}}
              loading={loading}
              onColumnFilterChange={(e) => {
                setTableFilters(e);
              }}
              onSorterValueChange={(e) => {
                console.log(e);
              }}
              items={state.orders}
              fields={[
                { key: "srno", label: "Sr. No.", filter: true },
                // { key: "productPriority", label: "Product Priority No.", filter: true },
                // { key: "categoryName", label: " Category", filter: true },
                // { key: "subCategory", label: "Sub Category", filter: true },
                { key: "name", filter: true, label: "Product Name" },
                // { key: "imageUrl",label:"Product Image", filter: false },
                { key: "totalQuantity", filter: false, label: "Total Quantity" },
                { key: "addBase",label:"Add Base Quantity", filter: false },
                { key: "description", filter: false, label: "Add Quantity" },
                { key: "producttype", label: "Remove Quantity", filter: false },
                // { key: "active", label: " Active/Inactive", filter: true },
                { key: "action", label: " Action", filter: false },
              ]}
              scopedSlots={{
                srno: (item, index) => {
                  return (
                    <td style={{border:"1px solid #dee2e6", backgroundColor: "#ffffff"}}>                    
                        {index+1}
                    </td>
                  );
                },
                name:  (item, index) => {
                  return (
                    <td style={{border:"1px solid #dee2e6", backgroundColor: "#ffffff"}}>
                      {/* <CTextarea
                        color="primary"
                        variant="outline"
                        shape="square"
                        size="sm"
                        onClick={() => history.push(`/orders/${item.id}`)}
                      > */}
                        {item.name}
                        <div><b>
                          {item.brandName}</b>
                        </div>
                      {/* </CTextarea> */}
                    </td>
                  );
                },
                totalQuantity:  (item, index) => {
                  return (
                    <td style={{border:"1px solid #dee2e6", backgroundColor: "#ffffff"}}>
                      {item.totalQuantity}{item.totalUnit}
                    </td>
                  );
                },
                addBase: (item, index) => {
                    return (
                      <td style={{border:"1px solid #dee2e6", backgroundColor: "#ffffff"}}>
                        <CLabel>Enter Base Quantity</CLabel>
                            <CInputGroup className="mb-3">
                                <CInput
                                    type="number"
                                    placeholder="Enter Weight"
                                    name="base"
                                    value={formData.values.base}
                                    onChange={(e) => {
                                        formData.handleChange(e);
                                    // setFormData({
                                    //   ...formData.values,
                                    //   name: e.target.value
                                    // })
                                    }}
                                />
                                <CDropdown>
                                        <CDropdownToggle
                                            style={{
                                            border: "1px solid #d8dbe0",
                                            borderRadius: "0.25rem",
                                            width: "100%",
                                            textAlign: "left"
                                            }}
                                            caret
                                            varient={"outline"}
                                        
                                        >
                                            {unit===""?"Select Units":unit}
                                        </CDropdownToggle>
                                        <CDropdownMenu style={{ width: "100%",}}>
                                            <CDropdownItem header>Select unit</CDropdownItem>
                                            <CDropdownItem divider />
                                            {gdata
                                            .filter((x) => x.id === "data")
                                            .map((sub) => {
                                                return sub.units.map((sub1) => {
                                                return <CDropdownItem
                                                    onClick={() => updatedType(sub1)}
                                                >
                                                    {sub1}
                                                </CDropdownItem>;
                                                });
                                            })}
                                        </CDropdownMenu>
                                        </CDropdown>
                                </CInputGroup>
                                  <CButton
                                    style={{
                                        color: "#fff",backgroundColor: "#00BFFF",borderColor: "#00BFFF",
                                        borderRadius: "0.25rem",
                                        marginRight: "5px",
                                    }}
                                    type="button"
                                    color="secondary"
                                    variant="outline"
                                    onClick={() => addBase(item.id)}
                                    >
                                    Add
                                    </CButton>
                      </td>
                    );
                  },
                description:(item, index) => {
                    return (
                      <td style={{border:"1px solid #dee2e6", backgroundColor: "#ffffff"}}>
                                      <CLabel>Enter Quantity to be Added</CLabel>
                                      <CInputGroup className="mb-3">
                                  <CInput
                                      type="number"
                                      placeholder="Enter Weight"
                                      name="in"
                                      value={formData.values.in}
                                      onChange={(e) => {
                                          formData.handleChange(e);
                                      // setFormData({
                                      //   ...formData.values,
                                      //   name: e.target.value
                                      // })
                                      }}
                                  />
                                  <CDropdown>
                                          <CDropdownToggle
                                              style={{
                                              border: "1px solid #d8dbe0",
                                              borderRadius: "0.25rem",
                                              width: "100%",
                                              textAlign: "left"
                                              }}
                                              caret
                                              varient={"outline"}
                                          
                                          >
                                              {unit===""?"Select Units":unit}
                                          </CDropdownToggle>
                                          <CDropdownMenu style={{ width: "100%",}}>
                                              <CDropdownItem header>Select unit</CDropdownItem>
                                              <CDropdownItem divider />
                                              {gdata
                                              .filter((x) => x.id === "data")
                                              .map((sub) => {
                                                  return sub.units.map((sub1) => {
                                                  return <CDropdownItem
                                                      onClick={() => updatedType(sub1)}
                                                  >
                                                      {sub1}
                                                  </CDropdownItem>;
                                                  });
                                              })}
                                          </CDropdownMenu>
                                          </CDropdown>
                                  </CInputGroup>
                                    <CButton
                                      style={{
                                        color: "#fff",backgroundColor: "#00BFFF",borderColor: "#00BFFF",
                                          borderRadius: "0.25rem",
                                          marginRight: "5px",
                                      }}
                                      type="button"
                                      color="secondary"
                                      variant="outline"
                                      onClick={() => qin(item.id)}
                                      >
                                      Add
                                      </CButton>
                      </td>
                    );
                  },
                producttype: (item, index) => {
                  return (
                    <td style={{border:"1px solid #dee2e6", backgroundColor: "#ffffff"}}>
                                    <CLabel>Enter Quantity to be Deducted</CLabel>
                                    <CInputGroup className="mb-3">
                                <CInput
                                    type="number"
                                    placeholder="Enter Weight"
                                    name="out"
                                    value={formData.values.out}
                                    onChange={(e) => {
                                        formData.handleChange(e);
                                    // setFormData({
                                    //   ...formData.values,
                                    //   name: e.target.value
                                    // })
                                    }}
                                />
                                <CDropdown>
                                        <CDropdownToggle
                                            style={{
                                            border: "1px solid #d8dbe0",
                                            borderRadius: "0.25rem",
                                            width: "100%",
                                            textAlign: "left"
                                            }}
                                            caret
                                            varient={"outline"}
                                        
                                        >
                                            {unit===""?"Select Units":unit}
                                        </CDropdownToggle>
                                        <CDropdownMenu style={{ width: "100%",}}>
                                            <CDropdownItem header>Select unit</CDropdownItem>
                                            <CDropdownItem divider />
                                            {gdata
                                            .filter((x) => x.id === "data")
                                            .map((sub) => {
                                                return sub.units.map((sub1) => {
                                                return <CDropdownItem
                                                    onClick={() => updatedType(sub1)}
                                                >
                                                    {sub1}
                                                </CDropdownItem>;
                                                });
                                            })}
                                        </CDropdownMenu>
                                        </CDropdown>
                                </CInputGroup>
                                  <CButton
                                    style={{
                                        color: "#fff",backgroundColor: "#00BFFF",borderColor: "#00BFFF",
                                        borderRadius: "0.25rem",
                                        marginRight: "5px",
                                    }}
                                    type="button"
                                    color="secondary"
                                    variant="outline"
                                    onClick={() => qout(item.id)}
                                    >
                                    Remove
                                    </CButton>
                    </td>
                  );
                },
                action: (item, index) => {
                  return (
                    <td style={{border:"1px solid #dee2e6", backgroundColor: "#ffffff"}}>
                        {
                           <CInputGroup style={{flexWrap: "nowrap"}}>
                              <CButton style={{ color: "#fff",backgroundColor: "#00BFFF",borderColor: "#00BFFF", borderRadius:"0.25rem", marginRight:"5px" }} type="button" color="secondary" variant="outline"onClick={() => edit(item,item.id)}>View</CButton>
                              {/* <CButton style={{ color: "#fff",backgroundColor: "#dc3545",borderColor: "#dc3545", borderRadius:"0.25rem" }} type="button" color="secondary" variant="outline" onClick={()=>remove(item.id)}>Delete</CButton> */}
                           </CInputGroup>
                        }
                      {/* </CTextarea> */}
                    </td>
                  );
                },
              }}
              hover
              striped
              columnFilter
              pagination
              // tableFilter
              sorter
              // itemsPerPageSelect
              itemsPerPage={30}
              // footer
              // // itemsPerPageSelect
              // itemsPerPage={5}
              
              // pagination
            />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
                marginBlock: 10,
              }}
            >
              {pageLoading ? (
                <CSpinner size="small" color="info" />
              ) : (
                <td hidden></td>
                // <CButton
                //   color="primary"
                //   disabled={pageLoading || loading}
                //   // variant="ghost"
                //   shape="square"
                //   size="sm"
                //   onClick={loadMoreOrders}
                // >
                //   Load More
                // </CButton>
              )}
            </div>
            {/* <CPagination
              activePage={page}
              onActivePageChange={pageChange}
              pages={5}
              doubleArrows={false}
              align="center"
            /> */}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Inventory;
