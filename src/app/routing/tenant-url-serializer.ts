import { Injectable, inject } from '@angular/core';
import {
  DefaultUrlSerializer,
  PRIMARY_OUTLET,
  UrlSerializer,
  UrlTree,
} from '@angular/router';
import { AppRoute } from '../app-route';
import { TenantStore } from '../state/tenant';

export const PUBLIC_SEGMENTS: readonly string[] = [
  AppRoute.Login,
  AppRoute.Register,
  AppRoute.VerifyEmail,
  AppRoute.SelectCompany,
  AppRoute.Onboarding,
  AppRoute.Maintenance,
];

@Injectable()
export class TenantUrlSerializer implements UrlSerializer {
  private readonly base = new DefaultUrlSerializer();
  private readonly tenant = inject(TenantStore);

  parse(url: string): UrlTree {
    const tree = this.base.parse(url);
    const primary = tree.root.children[PRIMARY_OUTLET];
    const first = primary?.segments[0]?.path;
    if (primary && first && !PUBLIC_SEGMENTS.includes(first)) {
      this.tenant.captureSlugFromUrl(first);
      primary.segments.splice(0, 1);
    }
    return tree;
  }

  serialize(tree: UrlTree): string {
    const url = this.base.serialize(tree);
    const slug = this.tenant.activeSlug();
    if (!slug) {
      return url;
    }
    const first = url.split(/[/?#]/).filter(Boolean)[0];
    if (first && PUBLIC_SEGMENTS.includes(first)) {
      return url;
    }
    return '/' + slug + url;
  }
}
