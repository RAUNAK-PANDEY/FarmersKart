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
  CInput,
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
} from "@coreui/react";
import firebase from "../../config/fbconfig";
import { exportDataToXLSX } from "../../utils/exportData";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useFormik } from "formik";

window.def = 1;
// // window.cdef = 0;
window.pro = 0;
// // window.cmsg = 0;
window.lef = 0;
window.del = 0;
// // window.name = 0;
const HotelReport = () => {
  const history = useHistory();

  const [tableFilters, setTableFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = React.useState(false);
  const [lorder, setLorder] = useState("");
  const [dorder, setDorder] = useState("");
  const [cat, setCat] = useState([]);
  const [data, setData] = useState([]);

  const socData = Date.now() - (30*(24 * 60 * 60 * 1000));
  const curData = Date.now();
  var[order, setOrder] = useState(socData);
  var[porder, setPorder] = useState(curData);

  var [state, setState] = useState({
    users: null,
    porder: null,
    lorder: null,
    dorder: null,
  });

  useEffect(() => {
    getUsers();
    // getPackage();
  }, []);

  const getPackage = async () => {
    const response = await firebase
      .firestore()
      .collection("generalData")
      .doc("data")
      .get();
    response.data().packersName.map((sub1) => {
      return data.push(sub1);
    });
    setData([...data, data]);
  };
  const getUsers = async () => {
    setLoading(true);
    const users = await firebase
      .firestore()
      .collection("orders")
      .where("datePlaced", ">=", order)
      .where("datePlaced", "<=", porder)
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
        ddate: new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(userData.datePlaced),
        date: userData.datePlaced,
        ddateDelivered: new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }).format(userData.dateDelivered),
        dateDelivered: userData.dateDelivered,
        amount: userData.totalAmount,
        cname: userData.customerName,
        cemail: userData.customerEmail,
        cphno: userData.customerNumber,
        fno: userData.flatNo,
        wing: userData.wing,
        socName: userData.societyName,
        status: userData.orderStatus,
        payment: userData.payment,
        packedBy: userData.packedBy,
        oitems: userData.items.map((sub) => {
          return sub.name;
        }),
        userType:userData.userType,
        isCancelled:userData.isCancelled,
        orderStatus:userData.orderStatus

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
    setCat(resolvedUsers)
    setLoading(false);
    // console.log(users.date);
  };
  const onExportData = async (e) => {
    state.users= cat;
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
        userType:item.userType,
        isCancelled:item.isCancelled,
        orderStatus:item.orderStatus
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

    const title = "Hotel Report";
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

    const data = e.map((elt) =>
    elt.isCancelled == false && elt.userType == "Hotel" && elt.orderStatus=="delivered"?
    [
      [elt.name + "\n" + elt.number],
      elt.wing,
      elt.flatNo,
      elt.societyName,
      elt.order.map((sub,index) =>
      sub.map((sub1) =>{
        let text = sub1.weight
        const myArray = text.split(" ");
        var temp=sub1.quantity*myArray[0]
        return([index+1+")",sub1.name,myArray[1] == "gms"? temp>=1000?(temp/1000)+"Kg" :temp+"gms" :myArray[1] == "ml"?temp>=1000?(temp/1000)+"Liters":temp+"ml":temp+myArray[1]]+"\n")
        // [
        //   sub1.name + " : " + sub1.quantity + " * " + sub1.weight + "\n",
        // ]
      })
    ),
  ]:[]);
  // const charge = [["Service Charge: Rs."+props.location.state.serviceCharges]]
  // const footer = [["Total Amount: Rs."+props.location.state.amount]]]

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
    doc.save("hotelreport.pdf");
  };
  const view = async (data, rowId) => {
    history.push({
      pathname: "/users/user",
      state: data,
      id: rowId,
    });
  };
  const onChangeDate =  (e) => {
    porder=new Date(document.getElementById("date-to").value).getTime();
    order=new Date(document.getElementById("date-from").value).getTime();
    getUsers();
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
              <CCol sm="4">
                    <div className="font-xl">Order List</div>
                </CCol>
                <CCol sm="1"></CCol>
                <CCol sm="2">
                    <div style={{width:"160px",marginLeft:"5px"}}>
                        From:
                        <span><CInput type="date" id="date-from" name="date-input" placeholder="date"/></span>
                    </div>
                </CCol>
                <CCol sm="2">
                    <div style={{width:"160px",marginLeft:"5px"}}>
                        To:
                        <span><CInput type="date" id="date-to" name="date-input" placeholder="date" onChange={() => onChangeDate()}/></span>   
                    </div>
                </CCol>
                <CCol sm="1"></CCol>
                <CCol sm="2">
                    <div>
                        <CButton
                            color="info"
                            className="mr-3"
                            onClick={() => onExportData()}
                        >
                            Export Data
                        </CButton>
                    </div>
                </CCol>
            
              {/* <CButton
                color="primary"
                // onClick={() => history.push("/users/create-user")}
              >
                Create User
              </CButton> */}
          </CCardHeader>
          <CCardBody>
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
                        { key: "index", label: "Sr No.", filter: false},
                      { key: "ddate", label: "Order Date", filter: true },
                      { key: "ddateDelivered", label: "Delivered Date", filter: true },
                      { key: "id", label: "Order Id", filter: true },
                      { key: "cphno", label: "User Details", filter: true },
                      // { key: "details", label: "User Details", filter: true},
                      { key: "wing", label: "Wing", filter: true },
                      { key: "fno", label: "Flat No", filter: true },
                      { key: "socName", label: "Society Name", filter: true },
                      { key: "oitems", label: "Order Details", filter: true },
                      { key: "amount", label: "Total Amount", filter: true },
                      //  // { key: "mode", label: "Payment" , filter: true},
                    //   { key: "action", label: "Action", filter: false },
                    //   { key: "packedBy", label: "Packed By", filter: true },
                    ]}
                    scopedSlots={{
                        index: (item,index) => {
                            return (
                                item.isCancelled == false && item.userType == "Hotel" && item.orderStatus=="delivered"?
                              <td>{index+1}
                              </td>:<td hidden></td>
                            );
                          },
                      ddate: (item) => {
                        return (
                            item.isCancelled == false && item.userType == "Hotel" && item.orderStatus=="delivered"?
                          <td>
                            <div>{item.ddate}</div>
                            <div>
                              {new Intl.DateTimeFormat("en-US", {
                                hour: "numeric",
                                minute: "numeric",
                              }).format(item.date)}
                            </div>
                          </td>:<td hidden></td>
                        );
                      },
                      ddateDelivered: (item) => {
                        return (
                            item.isCancelled == false && item.userType == "Hotel" && item.orderStatus=="delivered"?
                          <td>
                            <div>{item.ddateDelivered}</div>
                            <div>
                              {new Intl.DateTimeFormat("en-US", {
                                hour: "numeric",
                                minute: "numeric",
                              }).format(item.dateDelivered)}
                            </div>
                          </td>:<td hidden></td>
                        );
                      },
                      id: (item) => {
                       return  item.isCancelled == false && item.userType == "Hotel" && item.orderStatus=="delivered"?<td>{item.id.slice(0, 5)}</td>:<td hidden></td>;
                      },
                      cphno: (item) => {
                        return (
                            item.isCancelled == false && item.userType == "Hotel" && item.orderStatus=="delivered"?
                          <td>
                            <div>
                              <i class="fa fa-phone"></i>
                              {item.cname}
                            </div>
                            <div>{item.cemail}</div>
                            <div>{item.cphno}</div>
                          </td>:<td hidden></td>
                        );
                      },
                      wing: (item) => {
                        return  item.isCancelled == false && item.userType == "Hotel" && item.orderStatus=="delivered"?<td>{item.wing}</td>:<td hidden></td>;
                      },
                      fno: (item) => {
                        return  item.isCancelled == false && item.userType == "Hotel" && item.orderStatus=="delivered"?<td>{item.fno}</td>:<td hidden></td>;
                      },
                      socName: (item) => {
                        return  item.isCancelled == false && item.userType == "Hotel" && item.orderStatus=="delivered"?<td>{item.socName}</td>:<td hidden></td>;
                      },
                      oitems: (item) => {
                        return (
                            item.isCancelled == false && item.userType == "Hotel" && item.orderStatus=="delivered"?
                          <td>
                            {item.items.map((sub) => {
                              let text = sub.weight;
                              const myArray = text.split(" ");
                              var temp = sub.quantity * myArray[0];
                              return (
                                  <div>{sub.name} :  <span>{myArray[1] == "gms"? temp>=1000?(temp/1000)+"Kg" :temp+"gms" :myArray[1] == "ml"?temp>=1000?(temp/1000)+"Liters":temp+"ml":temp+myArray[1]}</span></div>
                              );
                            })}
                          </td>:<td hidden></td>
                        );
                      },
                      amount: (item) => {
                        return (
                            item.isCancelled == false && item.userType == "Hotel" && item.orderStatus=="delivered"?
                          <td>
                            {/* {item.payment.map((sub) => {
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
                            /> */}
                            <div>
                              Total = <b>₹</b>
                              {item.amount}
                            </div>
                          </td>:<td hidden></td>
                        );
                      },
                      mode: (item) => {
                        return  item.isCancelled == false && item.userType == "Hotel" && item.orderStatus=="delivered"?<td>{item.mode}</td>:<td hidden></td>;
                      },
                      action: (item, index) => {
                        return (
                          <td>
                            {
                              <CButton
                              style={{
                                color: "#333",
                                backgroundColor: "#00000000",
                                borderColor: "#c7c6c6",
                                borderRadius: "0.25rem",
                                marginRight: "5px",
                                width: "120px",
                                height: "40px",
                              }}
                              type="button"
                              color="secondary"
                              variant="outline"
                              onClick={() => view(item, item.id)}
                            >
                              View Order
                            </CButton>
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
                    itemsPerPage={30}
                    clickableRows
                    // onRowClick={(item) =>view(item.id)}
                  />
          </CCardBody>
        </CCard>
      </CCol>

      {/* <CCol xl={1} /> */}
    </CRow>
  );
};

export default HotelReport;