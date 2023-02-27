import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ColDef, GridApi, GridOptions, GridReadyEvent, IGetRowsParams } from 'ag-grid-community';
import { takeUntil } from 'rxjs';
import { AppConstants } from 'src/app/constants/AppConstants';
import { UserSearchDto } from 'src/app/models/User/UserSearchDto';
import { UserService } from 'src/app/services/user.service';
import { SelfUnsubscriberBase } from 'src/app/utils/SelfUnsubscriberBase';
import { DeleteButtonCellComponent } from './delete-button-cell/delete-button-cell.component';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent extends SelfUnsubscriberBase implements OnInit {
  gridApi!: GridApi;

  gridOptions!: GridOptions;

  params!: IGetRowsParams;

  rowData!: any;

  currentPage: number = 1;
  totalNumberOfPages!: number;
  totalNumberOfUsers!: number;
  currentNumberOfUsersStartRow: number = 1;
  currentNumberOfUsersEndRow!: number;

  searchedUserName: string = "";
  searchedEmail: string = "";

  title: string = 'User Manager'

  private deleteUsername!: string;

  columnDefs: ColDef[] = [
    { 
      headerName: "Username", 
      field: "username", 
      sortable: true,
    },
    { 
      headerName: "Email", 
      field: "email", 
      sortable: true,
    },
    {
      headerName: "First Name",
      field: "firstName",
      sortable: true, 
    },
    {
      headerName: "Last Name",
      field: "lastName",
      sortable: true,
    },
    { 
      headerName: "Country", 
      field: "country", 
      sortable: true,
    },
    {
      headerName: "State",
      field: "state",
      sortable: true,
    },
    {
      headerName: "City",
      field: "city",
      sortable: true,
    },
    {
      headerName: "Address",
      field: "address",
      sortable: false,
    },
    {
      headerName: "Phone Number",
      field: "phoneNumber",
      sortable: true
    },
    {
      headerName: "Delete",
      field: "delete",
      sortable: false,
      cellRenderer: DeleteButtonCellComponent,
      cellRendererParams: {
        clicked: (username:string ) => {
          this.deleteUsername = username;
          this.changeShowDeleteUser();
        }
      }
    },
  ]

  public defaultColDef: ColDef = {
    editable: false,
    resizable: false, 
  };

  isShownDeleteUser: boolean = false;

  constructor(
    private userService : UserService,
    private titleService: Title
  ){
    super();

    this.gridOptions = <GridOptions>{
      rowModelType: "clientSide",
      pagination: true,
      paginationPageSize: AppConstants.USERS_PER_PAGE,
      suppressPaginationPanel: true,
      suppressScrollOnNewData: true,
      cacheBlockSize: 10
    };
  }

  ngOnInit(): void {
    this.titleService.setTitle(this.title)
  }

  onGridReady(params: GridReadyEvent){
    this.gridApi = params.api;
    this.userService.getUsersPaginated(this.currentPage)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.rowData = result.getUserDto;
        this.totalNumberOfPages = result.numberOfPages;
        this.totalNumberOfUsers = result.numberOfUsers;
        this.currentNumberOfUsersEndRow = this.rowData.length;
      })
  }

  changeShowDeleteUser() {
    this.isShownDeleteUser = !this.isShownDeleteUser;
  }

  deleteUser(){
    this.userService.deleteUser(this.deleteUsername)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.changeShowDeleteUser();
        if(this.searchedUserName){
          this.getSearchedUsersByUserName(0);
        }

        if(this.searchedEmail){
          this.getSearchedUsersByEmail(0);
        }

        if(!this.searchedEmail && !this.searchedUserName){
          this.getPaginatedUsers(0);
        }
      });
  }


  nextPage(){
    this.currentPage++;
    
    if(this.searchedEmail){
      this.getSearchedUsersByEmail(1);
    }

    if(this.searchedUserName){
     this.getSearchedUsersByUserName(1)
    }

    if(!this.searchedEmail && !this.searchedUserName){
      this.getPaginatedUsers(1);
    }

  }

  lastPage(){
    this.currentPage = this.totalNumberOfPages;

    if(this.searchedEmail){
      this.getSearchedUsersByEmail(2);
    }

    if(this.searchedUserName){
      this.getSearchedUsersByUserName(2);
    }

    if(!this.searchedEmail && !this.searchedUserName){
      this.getPaginatedUsers(2);
    }
  }

  previousPage(){
    this.currentPage--;
  
    if(this.searchedEmail){
      this.getSearchedUsersByEmail(-1);
    }

    if(this.searchedUserName){
      this.getSearchedUsersByUserName(-1);
    }

    if(!this.searchedEmail && !this.searchedUserName){
      this.getPaginatedUsers(-1);
    }
  }

  firstPage(){
    this.currentPage = 1;
    
    if(this.searchedEmail){
      this.getSearchedUsersByEmail(-2);
    }

    if(this.searchedUserName){
      this.getSearchedUsersByUserName(-2);
    }

    if(!this.searchedEmail && !this.searchedUserName){
      this.getPaginatedUsers(-2);
    }
  }

  onSearchByUserName(){
    this.currentPage = 1;

    if(this.searchedEmail){
      this.searchedEmail = "";
    }

    if(this.searchedUserName){
      this.getSearchedUsersByUserName(-2);
    }
    else{
      this.getPaginatedUsers(-2);
    }
  }

  onSearchByEmail(){
    this.currentPage = 1;

    if(this.searchedUserName){
      this.searchedUserName = "";
    }

    if(this.searchedEmail){
     this.getSearchedUsersByEmail(-2);
    }
    else{
      this.getPaginatedUsers(-2);
    }
  }

  getPaginatedUsers(direction: number){
    this.userService.getUsersPaginated(this.currentPage)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        var numberOfNewUsers = result.getUserDto.length;
        var numberOfOldUsers = this.rowData.length;

        this.totalNumberOfPages = result.numberOfPages;
        this.totalNumberOfUsers = result.numberOfUsers;

        switch(direction){
          case -2:
            this.currentNumberOfUsersStartRow = 1;
            this.currentNumberOfUsersEndRow = numberOfNewUsers;
            break;
          case -1:
            this.currentNumberOfUsersEndRow -= numberOfOldUsers;
            this.currentNumberOfUsersStartRow -= numberOfNewUsers ;
            break;
          case 1:
            this.currentNumberOfUsersStartRow += numberOfOldUsers;
            this.currentNumberOfUsersEndRow += numberOfNewUsers;
            break;
          case 2:
            this.currentNumberOfUsersStartRow = this.totalNumberOfUsers - numberOfNewUsers + 1;
            this.currentNumberOfUsersEndRow = this.totalNumberOfUsers;
            break;
          default:
            this.currentNumberOfUsersStartRow = 0;
            this.currentNumberOfUsersEndRow = numberOfOldUsers;
        }
        this.rowData = result.getUserDto;
      })
  }

  getSearchedUsersByUserName(direction: number){
    var searchedUsers = new UserSearchDto();
    searchedUsers.page = this.currentPage;
    searchedUsers.search = this.searchedUserName;

    this.userService.getSearchedUsersByUserName(searchedUsers)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        var numberOfNewUsers = result.getUserDto.length;
        var numberOfOldUsers = this.rowData.length;

        this.totalNumberOfPages = result.numberOfPages;
        this.totalNumberOfUsers = result.numberOfUsers;

        switch(direction){
          case -2:
            this.currentNumberOfUsersStartRow = 1;
            this.currentNumberOfUsersEndRow = numberOfNewUsers;
            break;
          case -1:
            this.currentNumberOfUsersEndRow -= numberOfOldUsers;
            this.currentNumberOfUsersStartRow -= numberOfNewUsers ;
            break;
          case 1:
            this.currentNumberOfUsersStartRow += numberOfOldUsers;
            this.currentNumberOfUsersEndRow += numberOfNewUsers;
            break;
          case 2:
            this.currentNumberOfUsersStartRow = this.totalNumberOfUsers - numberOfNewUsers + 1;
            this.currentNumberOfUsersEndRow = this.totalNumberOfUsers;
            break;
          default:
            this.currentNumberOfUsersStartRow = 0;
            this.currentNumberOfUsersEndRow = numberOfOldUsers;
        }
        this.rowData = result.getUserDto;
      })
    }

  getSearchedUsersByEmail(direction: number){
    var searchedUsers = new UserSearchDto();
    searchedUsers.page = this.currentPage;
    searchedUsers.search = this.searchedEmail;

    this.userService.getSearchedUsersByEmail(searchedUsers)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        var numberOfNewUsers = result.getUserDto.length;
        var numberOfOldUsers = this.rowData.length;

        this.totalNumberOfPages = result.numberOfPages;
        this.totalNumberOfUsers = result.numberOfUsers;

        switch(direction){
          case -2:
            this.currentNumberOfUsersStartRow = 1;
            this.currentNumberOfUsersEndRow = numberOfNewUsers;
            break;
          case -1:
            this.currentNumberOfUsersEndRow -= numberOfOldUsers;
            this.currentNumberOfUsersStartRow -= numberOfNewUsers ;
            break;
          case 1:
            this.currentNumberOfUsersStartRow += numberOfOldUsers;
            this.currentNumberOfUsersEndRow += numberOfNewUsers;
            break;
          case 2:
            this.currentNumberOfUsersStartRow = this.totalNumberOfUsers - numberOfNewUsers + 1;
            this.currentNumberOfUsersEndRow = this.totalNumberOfUsers;
            break;
          default:
            this.currentNumberOfUsersStartRow = 0;
            this.currentNumberOfUsersEndRow = numberOfOldUsers;
        }
        this.rowData = result.getUserDto;
      })
  }

}
