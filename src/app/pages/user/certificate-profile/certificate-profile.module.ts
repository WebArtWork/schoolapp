import { NgModule } from '@angular/core';
import { CoreModule } from 'src/app/core/core.module';
import { CertificateProfileComponent } from './certificate-profile.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
	{
		path: '',
		component: CertificateProfileComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes), CoreModule],
	declarations: [CertificateProfileComponent]
})
export class CertificateProfileModule {}