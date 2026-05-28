from rest_framework.throttling import SimpleRateThrottle
    
class BaseScopedThrottle(SimpleRateThrottle):
    scope = None  

    def get_cache_key(self, request, view):
        ident = self.get_ident(request)
        return self.cache_format % {
            "scope": self.scope,
            "ident": ident
        }

class AuthenticationThrottle(BaseScopedThrottle):
    scope = "authentication"

class LinkCreateThrottle(BaseScopedThrottle):
    scope = "link_create"

class StatsOverviewThrottle(BaseScopedThrottle):
    scope = "stats_overview"

