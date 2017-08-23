import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';


export interface Slide {
    title: string;
    text: string;
}

@Component({
  selector: 'page-help',
  templateUrl: 'help.html'
})
export class HelpPage {

    slides : Array<Slide> = [
        {
            title: 'Bienvenue sur l\'aide !',
            text: 'Celle-ci est décomposée en plusieurs parties accessibles grâce au slider ci-dessous, n\'hésite pas à en faire le tour pour en apprendre plus sur ton intégration ;)'
        },
        {
            title: 'L\'application',
            text: 'Conçue cet été, elle permet de rendre plus interactive ta course aux challenges pour toi et tes amis mais également plus facile à suivre pour nous autres, membres du BDE'
        },
        {
            title: 'Ton chef',
            text: 'C\'est la personne à laquelle tu dois te référer dès que tu as une question, sans la moindre hésitation fonce dans ses bras si tu te sens vraiment perdu'
        },
        {
            title: 'La victoire',
            text: 'Pars à la conquête du Conseil des 4 et deviens le meilleur dresseur !'
        },
        {
            title: 'Bouton top secret',
            text: 'Voici Bobby. Bobby, c\'est le responsable de nos serveurs. Alors sois gentil, ne le malmène pas.'
        } 
    ];
    
    constructor(public navCtrl: NavController) {
        
    }

}
