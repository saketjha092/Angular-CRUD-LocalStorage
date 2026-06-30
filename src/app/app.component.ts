import { Component, OnInit } from '@angular/core';
import {FormGroup,FormArray,FormControl,Validators } from '@angular/forms'
import {CustomValidators} from './custom-valid/noFuture.validator'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'reactForms';
  reactiveForm: FormGroup;
  formSubmissions: any[] = []; 
  formdata:any={};
  showSubmittedData: boolean = false;
  editingIndex: number = -1; 
   ngOnInit(){
    this.reactiveForm = new FormGroup({
      name:new FormControl('',[Validators.required, CustomValidators.noSpaceAllowed]),
      email:new FormControl('',[Validators.required,Validators.email]),
      phone:new FormControl('',[Validators.required]),
      dob:new FormControl('',[Validators.required]),
      gender:new FormControl('',Validators.required),
      edu:new FormControl('',Validators.required),
      intro:new FormControl('',Validators.required),
      address:new FormGroup({
        address1:new FormControl('',Validators.required),
        country: new FormControl('India',Validators.required),
        city: new FormControl('',Validators.required),
        region: new FormControl('',Validators.required),
        pin: new FormControl('',Validators.required)
      }),
      skills:new FormArray([
        new FormControl('',Validators.required)
      ]),
      experience: new FormArray([
        new FormGroup({
          company:new FormControl('',Validators.required),
          position:new FormControl('',Validators.required),
          exp:new FormControl('',Validators.required),
          std:new FormControl('',Validators.required),
          end:new FormControl('',Validators.required)
        })
      ])
    })
    const storedFormSubmissions = localStorage.getItem('formSubmissions');
    if (storedFormSubmissions) {
      this.formSubmissions = JSON.parse(storedFormSubmissions);
    }
 }
showSubmitted() {
    this.showSubmittedData = true;
  }

 OnSubmit(){
  if (this.editingIndex !== -1) {
    this.formSubmissions[this.editingIndex] = this.reactiveForm.value;
    this.editingIndex = -1;
  } else {
    this.formSubmissions.push(this.reactiveForm.value);
  }
  localStorage.setItem('formSubmissions', JSON.stringify(this.formSubmissions));
  this.reactiveForm.reset();
  this.reactiveForm.enable();
}
  

 DeleteSkill(index: number){
  const controls = <FormArray>this.reactiveForm.get('skills');
  controls.removeAt(index);
}

AddSkills(){
  (<FormArray>this.reactiveForm.get('skills'))
    .push(new FormControl(''));
}

addexp(){
  const experiences = this.reactiveForm.get('experience') as FormArray;
  experiences.push(
    new FormGroup({
      company: new FormControl(''),
      position: new FormControl(''),
      exp: new FormControl(''),
      std: new FormControl(''),
      end: new FormControl('')
    })
  );
}

deleteExp(ind:number){
  const experiences = this.reactiveForm.get('experience') as FormArray;
  experiences.removeAt(ind);
}

editSubmission(index: number) {
  this.editingIndex = index;
  const submissionToEdit = this.formSubmissions[index];

  this.reactiveForm.patchValue({
    name: submissionToEdit.name,
    email: submissionToEdit.email,
    phone:submissionToEdit.phone,
    dob: submissionToEdit.dob,
    gender: submissionToEdit.gender,
    edu:submissionToEdit.edu,
    intro:submissionToEdit.intro,
    address: {
      address1: submissionToEdit.address.address1,
      country: submissionToEdit.address.country,
      city: submissionToEdit.address.city,
      region: submissionToEdit.address.region,
      pin: submissionToEdit.address.pin,
    },
    skills: submissionToEdit.skills,
  });
  const experiencesArray = this.reactiveForm.get('experience') as FormArray;
  experiencesArray.clear(); 
  submissionToEdit.experience.forEach((experience: any) => {
    experiencesArray.push(
      new FormGroup({
        company: new FormControl(experience.company),
        position: new FormControl(experience.position),
        exp: new FormControl(experience.exp),
        std: new FormControl(experience.std),
        end: new FormControl(experience.end)
      })
    );
  });
  this.reactiveForm.enable();
}

deleteSubmission(index: number) {
  this.formSubmissions.splice(index, 1);
  localStorage.setItem('formSubmissions', JSON.stringify(this.formSubmissions));
}
}
