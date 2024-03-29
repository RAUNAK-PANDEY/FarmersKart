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
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { useFormik } from "formik";

window.def = 1;
// // window.cdef = 0;
window.pro = 0;
// // window.cmsg = 0;
window.lef = 0;
window.del = 0;
// // window.name = 0;
const ActiveUsers = () => {
  const history = useHistory();

  const [tableFilters, setTableFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = React.useState(false);
  const [lorder, setLorder] = useState("");
  const [dorder, setDorder] = useState("");
  const [cat, setCat] = useState([]);
  const [data, setData] = useState([]);
  const [bool, setBool] = useState(false);

  // const socData = Date.now() - (30*(24 * 60 * 60 * 1000));
  // const curData = Date.now();
  const socData = new Date().setHours(0,0,0,0) - (15*(24 * 60 * 60 * 1000));
  const curData = new Date().setHours(23,59,59,999);
  var[order, setOrder] = useState(socData);
  var[porder, setPorder] = useState(curData);

  var [state, setState] = useState({
    users: null,
    porder: null,
    lorder: null,
    dorder: null,
  });
  var [stock, setStock] = useState({
    name: ([]),
    quantity:([]),
    weight: ([]),
    pid:([]),
    finalWeight :([]),
    finalPrice:([])
});
const[weight,setWeight]=useState([]);
  const[sName,setSName]=useState([]);
  const[sQuantity,setSQuantity]=useState([]);
  const[sfinal,setSFinal]=useState([]);
  const[sprice,setSPrice]=useState([]);
  const[catData,setCatdata]=useState([]);
  const[category,setCategory]=useState([]);

  useEffect(() => {
    getUsers();
  }, []);
  useEffect(() => {
    getdata();
  }, [refresh]);

  const getUsers = async () => {
    setLoading(true);
    const users = await firebase
      .firestore()
      .collection("orders")
      .where("datePlaced", ">=", order)
      .where("datePlaced", "<=", porder)
      .get();
    setOrder(users.docs.length);

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
        orderStatus:userData.orderStatus,
        temp:userData.items,
      };
    });
    setState({
      ...state,
      users: resolvedUsers,
    });
    setCat(resolvedUsers)
    setLoading(false);
    setRefresh(!refresh);
    setBool(true)
  };
  
  const getdata = () =>{
    try{
    var found = false;
        state.users.map((sub) =>{
            // console.log(sub);
            // if (sub.userType == 'Society' && sub.isCancelled == false) {
                // sub.temp.map(async(sub1,index)=>{
                    // console.log(stock.name.indexOf(sub1.name))
                    if (stock.name.indexOf(sub.cid) > -1) {

                    }else if (stock.name.indexOf(sub.cid) == -1) {

                        stock.name.push(sub.cid);
                        setStock({name:[...stock.name,stock.name]})
                        setSName(stock.name)

                        stock.pid.push(getCategory(sub.cid));
                        setStock({pid:[...stock.pid, stock.pid]});

                    }
                    else{
                      console.log("Clicked");
                    }
                  
                })
            // }
        // })
    }catch (error) {
            }
    setBool(false)
    
};

 const getCategory = async (name) => {
    // setLoading(true);
    const response=await firebase.firestore().collection("users").orderBy("name");
    const data=await response.get();
    data.docs.forEach(item=>{
        if(item.id == name)
            catData.push({id:item.id,...item.data()});
    })
    setCatdata([...catData,catData])
    // console.log(catData);
    // setLoading(false);
    // return catData;
    // console.log(users.date);
  };
  const onExportData = async (e) => {    
  // state.users = cat;
  const filteredData = catData
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
    .map((item,index) => ({
        name:item.name,
        mobile:item.mobile,
        wing:item.wing,
        flatNo:item.flatNo,
        societyName:item.societyName
    }));

    // console.log(filteredData);
    exportPDF(filteredData);
  exportDataToXLSX(filteredData, "activeCustomerreport");
};

const exportDataToXLSX = (dataJSON, filename) => {

  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

  const ws = XLSX.utils.json_to_sheet(dataJSON);
  const wb = { Sheets: { Orders: ws }, SheetNames: ['Orders'] };
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: fileType });
  FileSaver.saveAs(data, filename + '.xlsx');

}
const exportPDF = (e) => {
  const unit = "pt";
  const size = "A4"; // Use A1, A2, A3 or A4
  const orientation = "portrait"; // portrait or landscape

  const marginLeft = 40;
  const doc = new jsPDF(orientation, unit, size);

  doc.setFontSize(15);

  const title = "Active Customer Report";
  const headers = [["Customer Name","Customer Number","Wing","Flat No","Society Name"]];

  const data = e.map((sub,index) =>{
      return(
          [sub.name,sub.mobile,sub.wing,sub.flatNo,sub.societyName]
      )
  });
  // props.location.state.items.map(elt=>
  // const charge = [["Service Charge: Rs."+props.location.state.serviceCharges]]
  // const footer = [["Total Amount: Rs."+props.location.state.amount]]
  // let text = weight[index]
  //     const myArray = text.split(" ");
  //     var temp=sQuantity[index]*myArray[0]


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
  doc.save("ActiveCustomerReport.pdf")
}
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
    // setCategory([])
    setCatdata([])
    getUsers();
    // getOrders();
    setStock({
    name: ([]),
    quantity:([]),
    weight: ([]),
    pid:([]),
    finalWeight :([]),
    finalPrice:([])
  })
  setSName([])
  setSFinal([])
 
  // setSQuantity([])
  };
  const [status, setStatus] = useState("");
  const updatedStatus = async (s) => {
    setStatus(s);
    // console.log(s);
    // getUsers();
    // getVideos();1
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
                    <div className="font-xl">Active Users Report</div>
                </CCol>
                <CCol sm="1"></CCol>
                <CCol sm="2">
                    <div style={{width:"160px",marginLeft:"5px"}}>
                        From:
                        <span><CInput type="date" id="date-from" name="date-input" placeholder="date"/></span>
                    </div>
                </CCol>
                <CCol sm="1"></CCol>
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
          </CCardHeader>
          <CCardBody>
              
          <CDataTable
            loading={loading}
            onColumnFilterChange={(e) => {
                setTableFilters(e);
            }}
            onSorterValueChange={(e) => {
                // console.log(e);
            }}
            onTableFilterChange={(filter) => setTableFilters(filter)}
            items={catData}
            fields={[
                { key: "index", label:"Sr No", filter: false},
                { key: "name", label: "Customer Name", filter:true},
                { key: "mobile", label: "Customer Number", filter:true},
                { key: "wing", label: "Wing", filter: true},
                { key: "flatNo", label: "Flat No", filter: true},
                { key: "societyName", label: "Society Name", filter: true},
                { key: "userType", label: "Customer Type", filter:true},
                
            ]}
            scopedSlots={{
                index: (item,index) => {
                    return (
                        <td>{index+1}
                        </td>
                    );
                },
                name:(item)=>{
                    return(
                        <td>
                            {
                            item.name
                            }
                        </td>
                    );
                },
                mobile:(item)=>{
                    return(
                        <td>
                            {
                                item.mobile
                            }
                        </td>
                    );
                },
                wing:(item)=>{
                  return(
                      <td>
                          {
                              item.wing
                          }
                      </td>
                  );
              },
              flatNo:(item)=>{
                return(
                    <td>
                        {
                            item.flatNo
                        }
                    </td>
                );
              },
                societyName:(item,index)=>{
                    return(
                        <td>
                            {item.societyName}
                        </td>
                    );
                },
                userType:(item,index)=>{
                    return(
                        <td>{item.userType}</td>
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
          </CCardBody>
        </CCard>
      </CCol>

      {/* <CCol xl={1} /> */}
    </CRow>
  );
};

export default ActiveUsers;