import React, { useState, useEffect } from "react";
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
} from "@coreui/react";
import firebase from "../../config/fbconfig";
import { exportDataToXLSX } from "../../utils/exportData";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useFormik } from "formik";

const CancelOrder = () => {
  const history = useHistory();

  const [tableFilters, setTableFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = React.useState(false);
  const [order, setOrder] = useState("");
  const [porder, setPorder] = useState("");
  const [lorder, setLorder] = useState("");
  const [dorder, setDorder] = useState("");
  const [cat, setCat] = useState([]);
  var [state, setState] = useState({
    users: null,
    porder: null,
    lorder: null,
    dorder: null,
  });

  useEffect(() => {
    getUsers();
    getOrders();
  }, []);

  const getUsers = async () => {
    setLoading(true);
    const users = await firebase
      .firestore()
      .collection("orders")
      .orderBy("datePlaced")
      .where("isCancelled", "==", true)
      .get();
    setOrder(users.docs.length);
    // filter((x) => x.orderStatus === 'placed')

    const resolvedUsers = users.docs.map((user) => {
      const id = user.id;
      const userData = user.data();

      return {
        ...userData,
        id: id,
        cid: userData.customerId,
        ddate: new Intl.DateTimeFormat(['ban', 'id'], {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(userData.datePlaced),
        date: userData.datePlaced,
        amount: userData.totalAmount,
        cname: userData.customerName,
        cemail: userData.customerEmail,
        cphno: userData.customerNumber,
        fno: userData.flatNo,
        wing: userData.wing,
        socName: userData.societyName,
        status: userData.orderStatus,
        payment: userData.payment,
        oitems: userData.items.map((sub) => {
          return sub.name;
        }),
        comment: userData.comment,
        message: userData.message,
        type: userData.userType,

        // name: userData.name || "Not Defined",
        // whatsAppNumber: userData.whatsAppNumber || "-",
        // referralCode: userData.referralCode
        //   ? userData.referralCode.toString()
        //   : "",
        // primaryAddress:
        //   userData.addresses && userData.addresses.length > 0
        //     ? `${userData.addresses[0].line1}, ${userData.addresses[0].line2}, ${userData.addresses[0].city}, ${userData.addresses[0].state}`
        //     : "Not Defined",
        // id: user.id,
      };
    });
    setState({
      ...state,
      users: resolvedUsers,
    });
    setCat(resolvedUsers);
    setLoading(false);
    // console.log(users.date);
  };

  const getOrders = async () => {
    setLoading(true);
    const users = await firebase
      .firestore()
      .collection("handyOrders")
      .where("isCancelled", "==", true)
      .get();
    setPorder(users.docs.length);
    // filter((x) => x.orderStatus === 'placed')

    const resolvedUsers = users.docs.map((user) => {
      const id = user.id;
      const userData = user.data();

      return {
        ...userData,
        id: id,
        cid: userData.userId,
        list: userData.orderList,
        image: userData.imageUrl,
        cname: userData.name,
        // cid:userData.customerId,
        ddate: new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(userData.datePlaced),
        date: userData.datePlaced,
        // mode:userData.paymentMethod,
        amount: userData.totalAmount,
        type: userData.userType,
        cemail: userData.customerEmail,
        cphno: userData.customerNumber,
        fno: userData.flatNo,
        wing: userData.wing,
        socName: userData.societyName,
        comment: userData.comment,
        message: userData.message,

        // name: userData.name || "Not Defined",
        // whatsAppNumber: userData.whatsAppNumber || "-",
        // referralCode: userData.referralCode
        //   ? userData.referralCode.toString()
        //   : "",
        // primaryAddress:
        //   userData.addresses && userData.addresses.length > 0
        //     ? `${userData.addresses[0].line1}, ${userData.addresses[0].line2}, ${userData.addresses[0].city}, ${userData.addresses[0].state}`
        //     : "Not Defined",
        // id: user.id,
      };
    });
    setState({
      ...state,
      porder: resolvedUsers,
    });
    // setCat(resolvedUsers);
    setLoading(false);
    // console.log(users.date);
  };
  const onExportData = async (e) => {
    state.users = cat;
    const filteredData = state.users
      .filter((user) => {
        for (const filterKey in tableFilters) {
          console.log(
            String(user[filterKey]).search(
              new RegExp("tableFilters[filterKey]", "i")
            )
          );
          if (
            String(user[filterKey]).search(
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
      .map((item) => ({
        name: item.cname,
        number: item.cphno,
        wing: item.wing,
        flatNo: item.fno,
        societyName: item.socName,
        order: item.items.map((sub) => [sub]),
      }));

    // console.log(filteredData);
    exportPDF(filteredData);
    // exportDataToXLSX(filteredData, "usersList");
  };
  const exportPDF = (e) => {
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "portrait"; // portrait or landscape

    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(15);

    const title = "Society Order";
    // const cName = props.location.state.customerName
    const headers = [
      [
        "Customer Details",
        "Wing",
        "Flat No",
        "Society Name",
        "Order[Name,Quantity,Weight]",
      ],
    ];

    const data = e.map((elt) => [
      [elt.name + "\n" + elt.number],
      elt.wing,
      elt.flatNo,
      elt.societyName,
      elt.order.map((sub) =>
        sub.map((sub1) => [
          sub1.name + " : " + sub1.quantity + " * " + sub1.weight + "\n",
        ])
      ),
    ]);
    // props.location.state.items.map(elt=>
    // const charge = [["Service Charge: Rs."+props.location.state.serviceCharges]]
    // const footer = [["Total Amount: Rs."+props.location.state.amount]]

    let content = {
      startY: 50,
      head: headers,
      body: data,
      // content:charge,
      // foot:footer
    };

    // console.log(content);
    // console.log(data);
    doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    doc.save("societyorder.pdf");
  };
  const deleteVideo = (item,id) => {
    confirmAlert({
      title: "Delete",
      message: "Are you sure to Delete ?",
      buttons: [
        {
          label: "Yes",
          onClick: async() => {
            await firebase.firestore().collection("orders").doc(id).delete();
                alert("Order Deleted");
                history.push("/");
                history.replace("/users/cancelled-order");
                // history.goBack();
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
  const deleteOrder = (item,id) => {
    confirmAlert({
      title: "Delete",
      message: "Are you sure to Delete ?",
      buttons: [
        {
          label: "Yes",
          onClick: async() => {
            await firebase.firestore().collection("handyOrders").doc(id).delete();
                alert("Order Deleted");
                history.push("/");
                history.replace("/users/cancelled-order");
                // history.goBack();
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
  const view = async (data, rowId) => {
    history.push({
      pathname: "/users/user",
      state: data,
      id: rowId,
    });
  };

  return (
    <CRow>
      {/* <CCol xl={1} /> */}
      <CCol>
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
            <span className="font-xl">Cancelled Order List</span>
            <span>
              <CButton
                color="info"
                className="mr-3"
                //  onClick={() => onExportData()}
              >
                Export Data
              </CButton>
              {/* <CButton
                color="primary"
                // onClick={() => history.push("/users/create-user")}
              >
                Create User
              </CButton> */}
            </span>
          </CCardHeader>
          <CCardBody>
            <CTabs activeTab="home">
              <CNav variant="tabs">
                <CNavItem>
                  <CNavLink data-tab="home">Cancelled Orders {order}</CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink data-tab="profile">
                    Cancelled Handy Orders {porder}
                  </CNavLink>
                </CNavItem>
              </CNav>
              <CTabContent>
                <CTabPane data-tab="home">
                  <CDataTable
                    loading={loading}
                    onColumnFilterChange={(e) => {
                      setTableFilters(e);
                    }}
                    onSorterValueChange={(e) => {
                      console.log(e);
                    }}
                    onTableFilterChange={(filter) => setTableFilters(filter)}
                    items={state.users}
                    fields={[
                      { key: "ddate", label: "Order Date", filter: true },
                      { key: "id", label: "Order Id", filter: true },
                      { key: "type", label: "User Type", filter: true },
                      { key: "cname", label: "User Details", filter: true },
                      // { key: "details", label: "User Details", filter: true},
                      { key: "wing", label: "Wing", filter: true },
                      { key: "fno", label: "Flat No", filter: true },
                      { key: "socName", label: "Society Name", filter: true },
                      { key: "oitems", label: "Order Details", filter: true },
                      { key: "amount", label: "Total Amount", filter: true },
                      { key: "comment", label: "Comment", filter: true },
                      { key: "message", label: "Message", filter: true },
                      //  // { key: "mode", label: "Payment" , filter: true},
                        { key: "action", label: "Action" , filter: false},
                    ]}
                    scopedSlots={{
                      ddate: (item) => {
                        return (
                          <td>
                            <div>{item.ddate}</div>
                            <div>
                              {new Intl.DateTimeFormat("en-US", {
                                hour: "numeric",
                                minute: "numeric",
                              }).format(item.date)}
                            </div>
                          </td>
                        );
                      },
                      id: (item) => {
 
                        return <td>{item.id.slice(0, 5)}</td>;
 
                      },
                      type: (item) => {
                        return <td>{item.type}</td>;
                      },
                      cname: (item) => {
                        return (
                          <td>
                            <div>
                              <i class="fa fa-phone"></i>
                              {item.cname}
                            </div>
                            <div>{item.cemail}</div>
                            <div>{item.cphno}</div>
                          </td>
                        );
                      },
                      wing: (item) => {
                        return <td>{item.wing}</td>;
                      },
                      fno: (item) => {
                        return <td>{item.fno}</td>;
                      },
                      socName: (item) => {
                        return <td>{item.socName}</td>;
                      },
                      oitems: (item) => {
                        return (
                          <td>
                            {item.items.map((sub) => {
 
                                let text = sub.weight;
                                const myArray = text.split(" ");
                                var temp = sub.quantity * myArray[0];
                                return (
                                    <div>{sub.name} :  <span>{myArray[1] == "gms"? temp>=1000?(temp/1000)+"Kg" :temp+"gms" :myArray[1] == "ml"?temp>=1000?(temp/1000)+"Liters":temp+"ml":temp+myArray[1]}</span></div>
                                   
 
                              );
                            })}
                          </td>
                        );
                      },
                      amount: (item) => {
                        return (
                          <td>
                            {item.payment.map((sub) => {
                              return (
                                <div>
                                  {sub.method} = <b>₹</b>
                                  {sub.amount}
                                </div>
                              );
                            })}
                            <hr
                              style={{
                                width: "100%",
                                marginLeft: "auto",
                                marginRight: "auto",
                                overflow: "hidden",
                                border: "1px solid #333",
                              }}
                            />
                            <div>
                              Total = <b>₹</b>
                              {Math.round(item.amount)}
                            </div>
                          </td>
                        );
                      },
                      comment: (item) => {
                        return <td>{item.comment}</td>;
                      },
                      message: (item) => {
                        return <td>{item.message}</td>;
                      },
                        action: (item, index) => {
                          return (
                            <td>
                                {
                                  <CButton style={{ color: "#fff",backgroundColor: "#dc3545",borderColor: "#dc3545", borderRadius:"0.25rem",width:"120px",height:"40px" }} type="button" color="secondary" variant="outline" onClick={() => deleteVideo(item,item.id)}>Delete</CButton>

                                }
                            </td>
                          );
                        },
                    }}
                    hover
                    striped
                    columnFilter
                    // tableFilter
                    sorter
                    // pagination
                    // itemsPerPageSelect
                    pagination
                    // itemsPerPage={30}
                    itemsPerPage={30}
                    clickableRows
                    // onRowClick={(item) =>view(item.id)}
                  />
                </CTabPane>
                <CTabPane data-tab="profile">
                  <CDataTable
                    loading={loading}
                    onColumnFilterChange={(e) => {
                      setTableFilters(e);
                    }}
                    onSorterValueChange={(e) => {
                      console.log(e);
                    }}
                    onTableFilterChange={(filter) => setTableFilters(filter)}
                    items={state.porder}
                    fields={[
                      { key: "ddate", label: "Order Date", filter: true },
                      { key: "id", label: "Order Id", filter: true },
                      { key: "type", label: "User Type", filter: true },
                      { key: "cname", label: "User Details", filter: true },
                      // { key: "details", label: "User Details", filter: true},
                      { key: "wing", label: "Wing", filter: true },
                      { key: "fno", label: "Flat No", filter: true },
                      { key: "socName", label: "Society Name", filter: true },
                      //   { key: "oitems", label: "Order Details", filter: true},
                      { key: "image", label: "Order Image", filter: true },
                      { key: "list", label: "Order List", filter: true },
                      { key: "comment", label: "Comment", filter: true },
                      { key: "message", label: "Message", filter: true },
                      { key: "action", label: "Action" , filter: false},
                    ]}
                    scopedSlots={{
                      ddate: (item) => {
                        return (
                          <td>
                            <div>{item.ddate}</div>
                            <div>
                              {new Intl.DateTimeFormat("en-US", {
                                hour: "numeric",
                                minute: "numeric",
                              }).format(item.date)}
                            </div>
                          </td>
                        );
                      },
                      id: (item) => {
 
                        return <td>{item.id.slice(0, 5)}</td>;
 
                      },
                      type: (item) => {
                        return <td>{item.type}</td>;
                      },
                      cname: (item) => {
                        return (
                          <td>
                            <div>
                              <i class="fa fa-phone"></i>
                              {item.cname}
                            </div>
                            <div>{item.cemail}</div>
                            <div>{item.cphno}</div>
                          </td>
                        );
                      },
                      wing: (item) => {
                        return <td>{item.wing}</td>;
                      },
                      fno: (item) => {
                        return <td>{item.fno}</td>;
                      },
                      socName: (item) => {
                        return <td>{item.socName}</td>;
                      },
                      //   oitems:(item)=>{
                      //       return(
                      //           <td>
                      //               {
                      //                   item.items.map((sub) => {
                      //                     return(
                      //                         <div>{sub.name}</div>
                      //                     )
                      //                   })
                      //               }
                      //           </td>
                      //       );
                      //   },
                      image: (item) => {
                        return (
                          <td>
                            <CImg
                              // key={index}
                              rounded="true"
                              src={item.image}
                              width={160}
                              height={200}
                            />
                            {/* <b>₹</b>{Math.round(item.amount)} */}
                          </td>
                        );
                      },
                      list: (item) => {
                        return <td>{item.list}</td>;
                      },
                      comment: (item) => {
                        return <td>{item.comment}</td>;
                      },
                      message: (item) => {
                        return <td>{item.message}</td>;
                      },
                      action: (item, index) => {
                        return (
                          <td>
                              {
                                <CButton style={{ color: "#fff",backgroundColor: "#dc3545",borderColor: "#dc3545", borderRadius:"0.25rem",width:"120px",height:"40px" }} type="button" color="secondary" variant="outline" onClick={() => deleteOrder(item,item.id)}>Delete</CButton>
                              }
                          </td>
                        );
                      },
                    }}
                    hover
                    striped
                    columnFilter
                    // tableFilter
                    sorter
                    // pagination
                    // itemsPerPageSelect
                    // itemsPerPage={30}
                    clickableRows
                    // onRowClick={(item) =>view(item.id)}
                  />
                </CTabPane>
              </CTabContent>
            </CTabs>
          </CCardBody>
        </CCard>
      </CCol>

      {/* <CCol xl={1} /> */}
    </CRow>
  );
};

export default CancelOrder;
