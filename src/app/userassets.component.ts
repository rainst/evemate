import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocationService } from './location.service';
import { EveSSOService, EveSession } from './evesso.service';
import { EveCharactersService, Asset, Contract, WalletJournalEntry, WalletTransaction } from './evecharacters.service';


@Component({
  templateUrl: 'userassets.component.html'
})
export class UserAssetsComponent implements OnInit {
  private session: EveSession;  
  view: string;
  assetList: Asset[];
  contractList: Contract[];
  wallet: number;
  transactionList: WalletTransaction[];
  journalList: WalletJournalEntry[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private characters: EveCharactersService,
    private eveSSO: EveSSOService,
    private location: LocationService
  ) { }

  ngOnInit() { 
    this.route.params.subscribe(params => {
      this.view = params.v || 'assets';
      this.location.set('EVE Mate - User Assets, ' + this.view);
    });

    this.eveSSO.getSession().then(session => {
      this.session = session;

      this.resolveAssets();
      this.resolveWallet();
      this.resolveContracts();
      this.resolveJournal();
      this.resolveTransactions();
    });
  }

  resolveAssets() {
    this.characters.getAssets(this.session.CharacterID).then(assetList => {
      console.log(assetList);
      this.assetList = assetList;
    });
  }

  resolveWallet() {
    this.characters.getWallet(this.session.CharacterID).then(wallet => {
      console.log(wallet);
      this.wallet = wallet;
    });
  }

  resolveContracts() {
    this.characters.getContracts(this.session.CharacterID).then(contractList => {
      console.log(contractList);
      this.contractList = contractList;
    });
  }

  resolveJournal() {
    this.characters.getWalletJournal(this.session.CharacterID).then(journalList => {
      console.log(journalList);
      this.journalList = journalList;
    });
  }

  resolveTransactions() {
    this.characters.getWalletTransactions(this.session.CharacterID).then(transactionList => {
      console.log(transactionList);
      this.transactionList = transactionList;
    });
  }
}