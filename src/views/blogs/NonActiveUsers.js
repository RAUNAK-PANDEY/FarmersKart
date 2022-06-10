import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import {
  CBadge,
  CImg,
  CInputGroup,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CSpinner,
  CInput
} from "@coreui/react";
import firebase from "../../config/fbconfig";
import { exportDataToXLSX } from "../../utils/exportData";
import jsPDF from "jspdf";
import "jspdf-autotable";
const NonActiveUsers = () => {
  const history = useHistory();
  const socData = Date.now() - (15*(24 * 60 * 60 * 1000));
   const curData = Date.now();
  var[order, setOrder] = useState(socData);
   var[porder, setPorder] = useState(curData);
  var [cat, setCat] = useState([]);
  var [dat, setDat] = useState([]);
  const [tableFilters, setTableFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [lastOrder, setLastOrder] = useState("");
  // const [details, setDetails] = useState([]);
  const [refresh, setRefresh] = React.useState(false);
  var [state, setState] = useState({
    videos: null,
  });

  useEffect(() => {
    
    getOrders();
  }, [refresh]);

  const onChangeDate =  (e) => {
    var myDate1 = Date.parse(document.getElementById("date-to").value.split('-').reverse().join('-')); 
    
    console.log(myDate1)
    var myDate2 = Date.parse(document.getElementById("date-from").value.split('-').reverse().join('-')); 
     
    console.log(myDate2)

    porder=new Date(document.getElementById("date-to").value).getTime();
    order=new Date(document.getElementById("date-from").value).getTime();
    getOrders();
  };
  
  const getOrders = async () => {
    const response =   await firebase.firestore().collection("orders").where("datePlaced", ">=", order).where("datePlaced", "<=", porder).get();
    response.docs.forEach((item) => {
      
      let obj = cat.find(o => o.customerId === item.data().customerId   );
      if(!obj){
      cat.push({ id: item.id, ...item.data() });}
      
    });
    
    setCat([...cat, cat]);
    setDat([...dat, dat]);
     
    // console.log(cat);
  };
  console.log(cat)   
//   console.log(dat) 
//  let finalArr=[]
//  cat && cat.map((e1) => dat.map((e2) =>{   
// if(e1.customerId == e2.customerId)
// {
//   cat.pop(e1)
// }
//  }))
 
  // dat && dat.map((e2) =>{  
  //   // console.log(e2) 
  //   cat.splice(cat.findIndex(a => a.customerId == e2.customerId) , 1)
    
  //  }) 
    
  return (
    <CRow>
      {/* <CCol xl={1} /> */}
      <CCol>
        <CCard>
        <CCardHeader style={{ fontWeight: "bold",backgroundColor:"#f7f7f7",fontSize:"1.1rem",color: "black"}} >
        <CRow>
                <CCol sm="4">
                    <div className="font-xl">Non Active Users</div>
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
                
            </CRow>
                
                </CCardHeader>
          <CCardBody>
            <CDataTable style={{border:"1px solid #ebedf0"}}
              loading={loading}
              onTableFilterChange={(filter) => setTableFilters(filter)}
              items={cat}
              fields={[
                { key: "srno", label: "Sr. No.", filter: true },
                { key: "customerName", label: "customer Name", filter: true },
                { key: "customerNumber", label: "customer Number", filter:true},
                { key: "flatNo", label: "flat No", filter: true },
                { key: "societyName", label: "society Name", filter: true },
                 
                { key: "wing", label: "Wing", filter: true },
                { key: "userType", label: "user Type", filter: true },
                 
              ]}
              scopedSlots={{
                srno: (item, index) => {
                  return (
                    <td>
                        {index+1}
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
              itemsPerPage={50}
              clickableRows
              //   onRowClick={(item) => history.push(`/users/${item.id}`)}
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
          </CCardBody>
        </CCard>
      </CCol>

      {/* <CCol xl={1} /> */}
    </CRow>
  );
};

export default NonActiveUsers;
