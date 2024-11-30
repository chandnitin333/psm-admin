import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
constructor(private titleService: Title) {}
  public menus = [
    {
      "icon": "mdi mdi-map",
      "label":"जिल्हा",
      "url": "/admin/district"
    },
    {
      "icon": "mdi mdi-map-marker",
      "label":"तालुका",
      "url": "/admin/taluka"
    },
    {
      "icon": "mdi mdi-flag",
      "label":"ग्राम पंचायत",
      "url": "/admin/gram-panchayat"
    },
    {
      "icon": "mdi mdi-flag",
      "label":"गट ग्राम पंचायत",
      "url": "/admin/gat-gram-panchayat"
    },
    {
      "icon": "mdi mdi-account-plus",
      "label":"नविन यूजर जोडा",
      "url": "/admin/users"
    },
    // {
    //   "icon": "mdi mdi-account-edit",
    //   "label":"नविन यूजर एडिट जोडा",
    //   "url": ""
    // },
    // {
    //   "icon": "mdi mdi-account-edit",
    //   "label":"नविन यूजर फेरफार जोडा",
    //   "url": ""
    // },
    // {
    //   "icon": "mdi mdi-account-edit",
    //   "label":"नविन यूजर फेरफार पीडीएफ जोडा",
    //   "url": ""
    // },
    // {
    //   "icon": "mdi mdi-account-edit",
    //   "label":"नविन यूजर वसुली जोडा",
    //   "url": ""
    // },
    {
      "icon": "mdi mdi-office-building",
      "label":"फ्लोर",
      "url": "/admin/floor"
    },
    {
      "icon": "mdi mdi-file",
      "label":"प्रकार",
      "url": "/admin/prakar"
    },
    {
      "icon": "mdi mdi-file",
      "label":"मालमत्तेचे प्रकार",
      "url": "/admin/malmatteche-prakar"
    },
    {
      "icon": "mdi mdi-file",
      "label":"मिलकत वापर",
      "url": "/admin/milkat-vapar"
    },
    {
      "icon": "mdi mdi-file",
      "label":"मालमत्ता",
      "url": "/admin/malmatta"
    },
    {
      "icon": "mdi mdi-ticket-percent",
      "label":"टैक्स",
      "url": "/admin/tax"
    },
    {
      "icon": "mdi mdi-ticket-percent",
      "label":"इतर टैक्स",
      "url": "/admin/other-tax"
    },
    {
      "icon": "mdi mdi-ticket-percent",
      "label":"एनुअल टैक्स",
      "url": "/admin/annual-tax"
    },
    {
      "icon": "mdi mdi-cash-multiple",
      "label":"ओपन प्लाट रेट्स",
      "url": "/admin/open-plots-list"
    },
    {
      "icon": "mdi mdi-cash-multiple",
      "label":"घसारा दर",
      "url": "/admin/ghasara-dar"
    },
    {
      "icon": "mdi mdi-cash-multiple",
      "label":"भारांक दर",
      "url": "/admin/bharank-dar"
    },
    {
      "icon": "mdi mdi-radio-tower",
      "label":"टावर",
      "url": "/admin/tower"
    },
    {
      "icon": "mdi mdi-account-group",
      "label":"कार्यकारणी कमेटी",
      "url": "/admin/karya-karani-kameti"
    },
    {
      "icon": "mdi mdi-account-group",
      "label":"कामकाज कमेटी",
      "url": "/admin/kamkaj-kameti"
    },
    {
      "icon": "mdi mdi-google-maps",
      "label":"मैप",
      "url": ""
    },
    {
      "icon": "mdi mdi-file-upload",
      "label":"अपलोड फाइल",
      "url": "/admin/upload-file"
    },
    {
      "icon": "mdi mdi-account-plus",
      "label":"बी डी ओ नविन जोड़ा",
      "url": "admin/bdo"
    },
    {
      "icon": "mdi mdi-image-filter",
      "label":"सचिव इमेजेस",
      "url": "/admin/sachiv-list"
    },
    {
      "icon": "mdi mdi-image-filter",
      "label":"सरपंच इमेजेस",
      "url": "/admin/sarpanch-list"
    },
    {
      "icon": "mdi mdi-image-filter",
      "label":"उपसरपंच इमेजेस",
      "url": "/adin/oopsarpanch-list"
    },
    {
      "icon": "mdi mdi-account",
      "label":"एडमिन",
      "url": "/admin/admin"
    }
  ]

  ngOnInit(): void {
    this.titleService.setTitle('Home');
  }
}

