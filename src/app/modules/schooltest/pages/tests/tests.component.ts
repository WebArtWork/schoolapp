import { Component } from "@angular/core";
import { AlertService, CoreService, ModalService } from "wacom";
import { SchooltestService, Schooltest } from "../../services/schooltest.service";
import { FormService } from "src/app/core/modules/form/form.service";
import { TranslateService } from "src/app/core/modules/translate/translate.service";
import { FormInterface } from "src/app/core/modules/form/interfaces/form.interface";
import { Router } from "@angular/router";
import { TestQuestionsComponent } from './test-questions/test-questions.component';

@Component({
  templateUrl: "./tests.component.html",
  styleUrls: ["./tests.component.scss"],
})
export class TestsComponent {
  columns = ["name", "description", "duration", "questions", "data"];

  moduleType = this._router.url.split('/')[2];
  moduleId = this._router.url.split('/')[3];

  form: FormInterface = this._form.getForm("tests", {
    formId: "tests",
    title: "Tests",
    components: [
      {
        name: "Text",
        key: "name",
        focused: true,
        fields: [
          {
            name: "Placeholder",
            value: "fill tests title",
          },
          {
            name: "Label",
            value: "Title",
          },
        ],
      },
      {
        name: "Text",
        key: "description",
        fields: [
          {
            name: "Placeholder",
            value: "fill tests description",
          },
          {
            name: "Label",
            value: "Description",
          },
        ],
      },
      {
        name: "Number",
        key: "duration",
        fields: [
          {
            name: "Placeholder",
            value: "set tests duration",
          },
          {
            name: "Label",
            value: "Duration",
          },
        ],
      },
    ],
  });

  config = {
    create: () => {
      this._form.modal<Schooltest>(this.form, {
        label: "Create",
        click: (created: unknown, close: () => void) => {
          if (this.moduleId) {
            (created as Schooltest).moduleType = this.moduleType;
            (created as Schooltest).moduleId = this.moduleId;
          }
          this._ss.create(created as Schooltest);
          close();
        },
      });
    },
    update: (doc: Schooltest) => {
      this._form
        .modal<Schooltest>(this.form, [], doc)
        .then((updated: Schooltest) => {
          this._core.copy(updated, doc);
          this._ss.update(doc);
        });
    },
    delete: (doc: Schooltest) => {
      this._alert.question({
        text: this._translate.translate(
          "Common.Are you sure you want to delete this Schooltest?"
        ),
        buttons: [
          {
            text: this._translate.translate("Common.No"),
          },
          {
            text: this._translate.translate("Common.Yes"),
            callback: () => {
              this._ss.delete(doc);
            },
          },
        ],
      });
    },
    buttons: [
      {
        icon: "assignment_turned_in",
        click: (test: Schooltest) => {
					test.questions = test.questions || [];
					this._modal.show({
						component: TestQuestionsComponent,
						test
					});
				},
      },
      {
        icon: "cloud_download",
        click: (doc: Schooltest) => {
          this._form.modalUnique<Schooltest>("tests", "url", doc);
        },
      },
      {
				icon: 'card_membership',
				hrefFunc: (doc: Schooltest) => '/certificates/tests/' + doc._id
			}
    ],
  };

  get rows(): Schooltest[] {
    return this.moduleId
    ?this._ss.testsByModuleId[this.moduleId] || []
    :this._ss.schooltests;
  }

  constructor(
    private _translate: TranslateService,
    private _alert: AlertService,
    private _ss: SchooltestService,
    private _form: FormService,
    private _core: CoreService,
    private _router: Router,
    private _modal: ModalService
  ) {}
}
