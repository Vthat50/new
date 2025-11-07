import React, { useState } from 'react';
import { Search, User, MapPin, Phone, Mail, Building, CheckCircle, Loader } from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

interface NPILookupProps {
  initialNPI?: string;
  onSelect?: (provider: ProviderInfo) => void;
}

interface ProviderInfo {
  npi: string;
  firstName: string;
  lastName: string;
  credential?: string;
  organizationName?: string;
  taxonomy: string;
  taxonomyDescription: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
  };
  phone?: string;
  fax?: string;
  email?: string;
  isPrescriber: boolean;
  deaNumber?: string;
  licenseState?: string;
  licenseNumber?: string;
}

export default function NPILookup({ initialNPI, onSelect }: NPILookupProps) {
  const [searchQuery, setSearchQuery] = useState(initialNPI || '');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<ProviderInfo[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<ProviderInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter an NPI number or provider name');
      return;
    }

    setIsSearching(true);
    setError(null);
    setResults([]);

    try {
      // Call NPI Registry API
      const response = await fetch(
        `https://npiregistry.cms.hhs.gov/api/?version=2.1&number=${searchQuery}&limit=10`
      );

      if (!response.ok) {
        throw new Error('NPI lookup failed');
      }

      const data = await response.json();

      if (data.result_count === 0) {
        setError('No providers found matching your search');
        setResults([]);
        return;
      }

      // Parse API response into our format
      const providers: ProviderInfo[] = data.results.map((result: any) => {
        const address = result.addresses.find((addr: any) => addr.address_purpose === 'LOCATION') || result.addresses[0];
        const taxonomy = result.taxonomies.find((tax: any) => tax.primary) || result.taxonomies[0];

        return {
          npi: result.number,
          firstName: result.basic?.first_name || '',
          lastName: result.basic?.last_name || result.basic?.organization_name || '',
          credential: result.basic?.credential,
          organizationName: result.basic?.organization_name,
          taxonomy: taxonomy.code,
          taxonomyDescription: taxonomy.desc,
          address: {
            line1: address.address_1,
            line2: address.address_2,
            city: address.city,
            state: address.state,
            postalCode: address.postal_code,
          },
          phone: address.telephone_number,
          fax: address.fax_number,
          isPrescriber: taxonomy.desc.toLowerCase().includes('physician') ||
                       taxonomy.desc.toLowerCase().includes('prescriber'),
          licenseState: taxonomy.state,
          licenseNumber: taxonomy.license,
        };
      });

      setResults(providers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search NPI registry');

      // Fallback to mock data for demo
      const mockProviders: ProviderInfo[] = [
        {
          npi: '1234567890',
          firstName: 'John',
          lastName: 'Smith',
          credential: 'MD',
          taxonomy: '207R00000X',
          taxonomyDescription: 'Internal Medicine',
          address: {
            line1: '123 Medical Plaza',
            city: 'Los Angeles',
            state: 'CA',
            postalCode: '90001',
          },
          phone: '(310) 555-1234',
          email: 'jsmith@medicalpractice.com',
          isPrescriber: true,
          deaNumber: 'AS1234567',
          licenseState: 'CA',
          licenseNumber: 'G12345',
        },
      ];
      setResults(mockProviders);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectProvider = (provider: ProviderInfo) => {
    setSelectedProvider(provider);
    if (onSelect) {
      onSelect(provider);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div
      style={{
        border: `1px solid ${colors.neutral[200]}`,
        borderRadius: '8px',
        padding: spacing[4],
        backgroundColor: 'white',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: spacing[4] }}>
        <h3 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold, marginBottom: spacing[2] }}>
          NPI Lookup
        </h3>
        <p style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
          Search the National Provider Identifier registry by NPI number or provider name
        </p>
      </div>

      {/* Search Input */}
      <div style={{ display: 'flex', gap: spacing[2], marginBottom: spacing[4] }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search
            style={{
              position: 'absolute',
              left: spacing[3],
              top: '50%',
              transform: 'translateY(-50%)',
              width: '16px',
              height: '16px',
              color: colors.neutral[400],
            }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter NPI number or provider name..."
            style={{
              width: '100%',
              padding: `${spacing[3]} ${spacing[3]} ${spacing[3]} ${spacing[10]}`,
              border: `1px solid ${colors.neutral[300]}`,
              borderRadius: '6px',
              fontSize: typography.fontSize.sm,
              outline: 'none',
            }}
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={isSearching}
          style={{
            padding: `${spacing[3]} ${spacing[6]}`,
            backgroundColor: isSearching ? colors.neutral[300] : colors.primary[500],
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.medium,
            cursor: isSearching ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: spacing[2],
          }}
        >
          {isSearching && <Loader style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />}
          {isSearching ? 'Searching...' : 'Search'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div
          style={{
            padding: spacing[3],
            backgroundColor: colors.status.errorBg,
            border: `1px solid ${colors.status.error}`,
            borderRadius: '6px',
            marginBottom: spacing[4],
            fontSize: typography.fontSize.sm,
            color: colors.status.error,
          }}
        >
          {error}
        </div>
      )}

      {/* Search Results */}
      {results.length > 0 && (
        <div style={{ marginBottom: spacing[4] }}>
          <div
            style={{
              fontSize: typography.fontSize.sm,
              color: colors.neutral[600],
              marginBottom: spacing[3],
            }}
          >
            Found {results.length} provider{results.length !== 1 ? 's' : ''}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
            {results.map((provider) => (
              <div
                key={provider.npi}
                onClick={() => handleSelectProvider(provider)}
                style={{
                  padding: spacing[4],
                  border: `1px solid ${selectedProvider?.npi === provider.npi ? colors.primary[500] : colors.neutral[200]}`,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  backgroundColor: selectedProvider?.npi === provider.npi ? colors.primary[50] : 'white',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: spacing[3] }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
                    <User style={{ width: '20px', height: '20px', color: colors.primary[500] }} />
                    <div>
                      <div style={{ fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.semibold }}>
                        {provider.organizationName || `${provider.firstName} ${provider.lastName}`}
                        {provider.credential && `, ${provider.credential}`}
                      </div>
                      <div style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
                        NPI: {provider.npi}
                      </div>
                    </div>
                  </div>
                  {selectedProvider?.npi === provider.npi && (
                    <CheckCircle style={{ width: '20px', height: '20px', color: colors.primary[500] }} />
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: spacing[3] }}>
                  <div>
                    <div
                      style={{
                        fontSize: typography.fontSize.xs,
                        color: colors.neutral[500],
                        marginBottom: spacing[1],
                      }}
                    >
                      Specialty
                    </div>
                    <div style={{ fontSize: typography.fontSize.sm }}>
                      {provider.taxonomyDescription}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: typography.fontSize.xs,
                        color: colors.neutral[500],
                        marginBottom: spacing[1],
                      }}
                    >
                      Address
                    </div>
                    <div style={{ fontSize: typography.fontSize.sm }}>
                      {provider.address.line1}
                      {provider.address.line2 && <br />}
                      {provider.address.line2}
                      <br />
                      {provider.address.city}, {provider.address.state} {provider.address.postalCode}
                    </div>
                  </div>
                  {provider.phone && (
                    <div>
                      <div
                        style={{
                          fontSize: typography.fontSize.xs,
                          color: colors.neutral[500],
                          marginBottom: spacing[1],
                        }}
                      >
                        Phone
                      </div>
                      <div style={{ fontSize: typography.fontSize.sm }}>{provider.phone}</div>
                    </div>
                  )}
                  {provider.email && (
                    <div>
                      <div
                        style={{
                          fontSize: typography.fontSize.xs,
                          color: colors.neutral[500],
                          marginBottom: spacing[1],
                        }}
                      >
                        Email
                      </div>
                      <div style={{ fontSize: typography.fontSize.sm }}>{provider.email}</div>
                    </div>
                  )}
                  {provider.isPrescriber && (
                    <div>
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: spacing[1],
                          padding: `${spacing[1]} ${spacing[2]}`,
                          backgroundColor: colors.status.successBg,
                          border: `1px solid ${colors.status.success}`,
                          borderRadius: '4px',
                          fontSize: typography.fontSize.xs,
                          color: colors.status.success,
                          fontWeight: typography.fontWeight.medium,
                        }}
                      >
                        <CheckCircle style={{ width: '12px', height: '12px' }} />
                        Prescriber
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected Provider Details */}
      {selectedProvider && (
        <div
          style={{
            padding: spacing[4],
            backgroundColor: colors.primary[50],
            border: `1px solid ${colors.primary[200]}`,
            borderRadius: '6px',
          }}
        >
          <div
            style={{
              fontSize: typography.fontSize.md,
              fontWeight: typography.fontWeight.semibold,
              marginBottom: spacing[3],
              display: 'flex',
              alignItems: 'center',
              gap: spacing[2],
            }}
          >
            <CheckCircle style={{ width: '20px', height: '20px', color: colors.primary[500] }} />
            Selected Provider
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: spacing[3] }}>
            <div>
              <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600], marginBottom: spacing[1] }}>
                NPI Number
              </div>
              <div style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium }}>
                {selectedProvider.npi}
              </div>
            </div>
            {selectedProvider.licenseNumber && (
              <div>
                <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600], marginBottom: spacing[1] }}>
                  State License
                </div>
                <div style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium }}>
                  {selectedProvider.licenseState} #{selectedProvider.licenseNumber}
                </div>
              </div>
            )}
            {selectedProvider.deaNumber && (
              <div>
                <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600], marginBottom: spacing[1] }}>
                  DEA Number
                </div>
                <div style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium }}>
                  {selectedProvider.deaNumber}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
