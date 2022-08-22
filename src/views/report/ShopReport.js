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
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

window.def = 1;
// // window.cdef = 0;
window.pro = 0;
// // window.cmsg = 0;
window.lef = 0;
window.del = 0;
// // window.name = 0;
const ShopReport = () => {
  const history = useHistory();

  const [tableFilters, setTableFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = React.useState(false);
  const [lorder, setLorder] = useState("");
  const [dorder, setDorder] = useState("");
  const [cat, setCat] = useState([]);
  const [data, setData] = useState([]);

  // const socData = Date.now() - (30*(24 * 60 * 60 * 1000));
  // const curData = Date.now();
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
  const [status, setStatus] = useState("");

    useEffect(() => {
    getVideos();
    getUsers();
  }, []);

  const getVideos = async () => {
    const response = await firebase.firestore().collection("centers").orderBy("centerName");
    const data = await response.get();
    data.docs.forEach((item) => {
      cat.push({ docId: item.id, ...item.data() });
    });
    setCat([...cat, cat]);
  };
  const updatedStatus = async (s) => {
    setStatus(s);
    // console.log(s);
    getUsers();
    getVideos();
  };
  const getUsers = async () => {
    setLoading(true);
    const users = await firebase
      .firestore()
      .collection("orders")
      .where("dateDelivered", ">=", order)
      .where("dateDelivered", "<=", porder)
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
      };
    });
    setState({
      ...state,
      users: resolvedUsers,
    });
    setData(resolvedUsers)
    setLoading(false);
    // console.log(users.date);
  };
  const onExportData = async (e) => {
    let temp = 0;
    let wtemp =0;
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
        // id:item.id,
        centerName:item.centerName,
        orderCount:wtemp = cat.map((sub) =>{
          let count =0;
          let wallet = 0;
          data.map((sub1)=>{
              if(sub1.isCancelled == false && sub1.orderStatus=="delivered" && sub1.socName == item.centerName){
                count++
              }     
          })
          // console.log(count);
          return (count)
        }),
        totalAmount:temp = cat.map((sub,index) =>{
          let count =0;
          let wallet = 0;
          data.map((sub1)=>{
              if(sub1.isCancelled == false && sub1.orderStatus=="delivered" && sub1.socName == item.centerName){
                wallet = wallet + sub1.amount;
              }     
          })
          return (wallet)  
        })
        
      }));

    // console.log(filteredData);
    exportPDF(data,filteredData);
    // exportDataToXLSX(filteredData, "SocWiseReport");
  };
  const exportDataToXLSX = (dataJSON, filename) => {

    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  
    const ws = XLSX.utils.json_to_sheet(dataJSON);
    const wb = { Sheets: { Orders: ws }, SheetNames: ['Orders'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, filename + '.xlsx');
  
  }
  const exportPDF = (e,c) => {
    
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "portrait"; // portrait or landscape

    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(15);

    const title = "Societywise Report";
    // const cName = props.location.state.customerName
    const headers = [
      [
        "Society Name",
        "Total No of Orders",
        "Total Amount",
      ],
    ];

    const data = c.map((sub) =>{
      let count =0;
      let wallet = 0;
      e.map((sub1)=>{
          if(sub1.isCancelled == false && sub1.orderStatus=="delivered" && sub1.socName == sub.centerName){
            wallet = wallet + sub1.amount;
            count++
          }     
      })
      return[sub.centerName,count,wallet]
    });
  // const charge = [["Service Charge: Rs."+props.location.state.serviceCharges]]
  // const footer = [["Total Amount: Rs."+props.location.state.amount]]]

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
    doc.save("societyreport.pdf");
  };
  const view = async (data, rowId) => {
    history.push({
      pathname: "/users/user",
      state: data,
      id: rowId,
    });
  };
  const onChangeDate =  (e) => {
    porder=new Date(document.getElementById("date-to").value).setHours(23,59,59,999);
    order=new Date(document.getElementById("date-from").value).setHours(0,0,0,0);
    // getUsers();
    getUsers();
    getVideos();
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
              <CCol sm="3">
                    <div className="font-xl">Societywise Reports</div>
                </CCol>
                <CCol sm="1">
                    <div style={{width:"160px",marginLeft:"5px"}}>
                        From:
                        <span><CInput type="date" id="date-from" name="date-input" placeholder="date"/></span>
                    </div>
                </CCol>
                <CCol sm="1">
                    <div style={{width:"160px",marginLeft:"5px"}}>
                        To:
                        <span><CInput type="date" id="date-to" name="date-input" placeholder="date" onChange={() => onChangeDate()}/></span>   
                    </div>
                </CCol>
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
          </CCardHeader>
          <CCardBody>
              {/* <CRow>
              <CCol md="2">
                  <CLabel htmlFor="inputEmail4">Society Name</CLabel>
                  </CCol>
                  <CCol md={4} sm="6" style={{marginTop:"-15px"}}>
                    <CDropdown className="mt-2">
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
                        {status ===""?"Select Society Name":status}
                      </CDropdownToggle>
                      <CDropdownMenu style={{ width: "100%",}}>
                        <CDropdownItem header>Select Society Name</CDropdownItem>
                        <CDropdownItem divider />
                        <CDropdownItem
                                onClick={() => updatedStatus("All")}
                              >
                                All
                              </CDropdownItem>
                        {
                          cat.map((cat, index) => {
                            return (
                              <CDropdownItem
                              required
                                onClick={() => updatedStatus(cat.centerName)}
                              >
                                {cat.centerName}
                              </CDropdownItem>
                            );
                          })}
                      </CDropdownMenu>
                    </CDropdown>
                     {/* <CInput
                      required 
                      type="text"
                      placeholder="Society Name"
                      name="societyName"
                      value={formData.values.societyName}
                      onChange={(e) => {
                        formData.handleChange(e);
                        // setFormData({
                        //   ...formData.values,
                        //   name: e.target.value
                        // })
                      }}
                    /> */}
                {/* </CCol> 
              </CRow>  */}
              <CRow>
                <CDataTable
                    loading={loading}
                    onColumnFilterChange={(e) => {
                      setTableFilters(e);
                    }}
                    onSorterValueChange={(e) => {
                      console.log(e);
                    }}
                    onTableFilterChange={(filter) => setTableFilters(filter)}
                    items={cat}
                    fields={[
                      { key: "centerName", label: "Society Name", filter: true },
                        { key: "index", label: "Total No. Of Orders", filter: false},
                      { key: "amount", label: "Total Amount", filter: false},
                      
                    ]}
                    scopedSlots={{
                        index: (item,index) => {
                            let wallet = 0;
                                data.map((sub)=>{
                                  // if(status == "All"){
                                  //   if(sub.isCancelled == false && sub.orderStatus=="delivered")
                                  //       wallet++
                                  // }else{
                                    if(sub.isCancelled == false && sub.socName == item.centerName && sub.orderStatus=="delivered")
                                        wallet++
                                  // }     
                                })
                            return (
                                <td>{wallet}</td>
                                );
                          },
                      amount: (item,index) => {
                        let wallet = 0;
                                data.map((sub)=>{
                                    if(sub.isCancelled == false && sub.orderStatus=="delivered" && sub.socName == item.centerName)
                                        wallet = wallet + sub.amount;
                                    
                                })
                            return (
                                <td><b>₹</b>{wallet}</td>
                        );
                      },
                      centerName: (item,index) => {
                            return (
                              <td>{item.centerName}</td>
                        );
                      },
                    }}
                    hover
                    striped
                    columnFilter
                    sorter
                    pagination
                    itemsPerPage={30}
                    clickableRows
                  />
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>

      {/* <CCol xl={1} /> */}
    </CRow>
  );
};

export default ShopReport;