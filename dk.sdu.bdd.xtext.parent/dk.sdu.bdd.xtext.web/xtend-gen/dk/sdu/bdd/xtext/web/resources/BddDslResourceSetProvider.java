package dk.sdu.bdd.xtext.web.resources;

import com.google.inject.Inject;
import com.google.inject.Provider;
import org.eclipse.emf.ecore.resource.ResourceSet;
import org.eclipse.xtext.web.server.IServiceContext;
import org.eclipse.xtext.web.server.ISession;
import org.eclipse.xtext.web.server.model.IWebResourceSetProvider;
import org.eclipse.xtext.xbase.lib.Functions.Function0;
import org.eclipse.xtext.xbase.lib.Pair;

@SuppressWarnings("all")
public class BddDslResourceSetProvider implements IWebResourceSetProvider {
  private static final String MULTI_RESOURCE_PREFIX = "multi-resource";

  @Inject
  private Provider<ResourceSet> provider;

  @Override
  public ResourceSet get(final String resourceId, final IServiceContext serviceContext) {
    ResourceSet _xifexpression = null;
    if (((resourceId != null) && resourceId.startsWith(BddDslResourceSetProvider.MULTI_RESOURCE_PREFIX))) {
      final int pathEnd = Math.max(resourceId.indexOf("/"), BddDslResourceSetProvider.MULTI_RESOURCE_PREFIX.length());
      ISession _session = serviceContext.getSession();
      String _substring = resourceId.substring(0, pathEnd);
      Pair<Class<ResourceSet>, String> _mappedTo = Pair.<Class<ResourceSet>, String>of(ResourceSet.class, _substring);
      final Function0<ResourceSet> _function = () -> {
        return this.provider.get();
      };
      return _session.<ResourceSet>get(_mappedTo, _function);
    } else {
      _xifexpression = this.provider.get();
    }
    return _xifexpression;
  }
}
